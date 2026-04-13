require("dotenv").config();
const express = require("express");
const PERSON = require("./models/persons");
const morgan = require("morgan");
const cors = require("cors");
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Fichiers statiques du frontend
app.use(express.static(path.join(__dirname, 'dist')));

morgan.token("body", (request) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
  return "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// ── Routes API ──────────────────────────────────────
app.get("/api/persons", (request, response) => {
  PERSON.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response, next) => {
  PERSON.countDocuments()
    .then((nb) => {
      const date = new Date().toString();
      response.send(`<p>Phonebook has info for ${nb} people</p><p>${date}</p>`);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  PERSON.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  PERSON.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;
  if (!name || !number) {
    return response.status(401).json({ error: "all values must be required" });
  }
  new PERSON({ name, number })
    .save()
    .then((saved) => response.status(201).json(saved))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  PERSON.findById(request.params.id)
    .then((person) => {
      person.name = request.body.name;
      person.number = request.body.number;
      return person.save();
    })
    .then((saved) => response.json(saved))
    .catch((error) => next(error));
});

// ── Route catch-all : DOIT être après toutes les routes API ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ── Error handler ────────────────────────────────────
const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted Id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

// ── Démarrage ────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;