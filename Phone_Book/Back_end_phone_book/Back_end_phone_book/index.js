require("dotenv").config();
const express = require("express");
const PERSON = require("./models/persons");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());
app.use(express.static('dist'));

//app.use(morgan('tiny'))

morgan.token("body", (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  } else {
    return "";
  }
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/api/persons", (request, response) => {
  PERSON.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response, next) => {
  PERSON.countDocuments()
    .then((nb) => {
      const date = new Date().toString();
      response.send(`<p>Phonebook has info for ${nb} people</p>
        <p>${date}</p>`);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  PERSON.findById(id)
    .then((person) => {
      if (person) {
        console.log(person);
        response.json(person);
      } else {
        return response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  PERSON.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(401).json({ error: "all values must be required" });
  } else {
    let newPerson = new PERSON({
      name: body.name,
      number: body.number,
    });

    newPerson
      .save()
      .then((personsaved) => {
        response.status(201).json(personsaved);
      })
      .catch((error) => {
        next(error);
      });
  }
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const body = request.body;
  PERSON.findById(id)
    .then((personUpdated) => {
      personUpdated.name = body.name;
      personUpdated.number = body.number;

      return personUpdated.save();
    })
    .then((personSave) => {
      response.json(personSave);
    })
    .catch((error) => next(error));
});


const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: "unknow endpoint" });
};


app.use(unknowEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === " CastError") {
    response.status(400).send({ error: "malformatted Id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);
const PORT = process.env.PORT||3001;
app.listen(PORT, () => {
  console.log(`port in running on port ${PORT}`);
});

module.exports =app;
