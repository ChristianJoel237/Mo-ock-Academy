const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Note = require("./model/note");
app.use(cors());
mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI;

mongoose.connect(url);
app.use(express.static("dist"));

app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response,next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/notes/:id", (request, response,next) => {
 Note.findByIdAndDelete(request.params.id).then( result=>  response.status(204).end()).catch( error=>{
  next(error)
 })

});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });
  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.put("/api/notes/:id", (req, res,next) => {
  const {content,important} = req.body
  Note.findById(req.params.id).then( note =>{
    if(!note){
      res.status(404).end()
    }
    note.content = content
    note.important = important
    return note.save().then(noteSaved=>{
      res.json(noteSaved)
    })
  }).catch( error => next(error))
 
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);


const errorHandler = (error,request ,response ,next )=>{
   
  if(error.name === 'CastError'){
    response.status(400).send({error:"malformatted id"})
  }
  next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
