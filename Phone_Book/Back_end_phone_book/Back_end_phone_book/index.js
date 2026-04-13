require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const PERSON = require("./models/persons");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();

// ── Connexion MongoDB optimisée pour Vercel serverless ──
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log("MongoDB connected");
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

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
app.get("/api/persons", (request, response, next) => {
  PERSON.find({})
    .then((persons) => response.json(persons))
    .catch((error) => next(error));
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

// ── Route catch-all frontend ──────────────────────────
app.get('(.*)', (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
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

// ── IMPORTANT : pas de app.listen() pour Vercel ──────
module.exports = app;