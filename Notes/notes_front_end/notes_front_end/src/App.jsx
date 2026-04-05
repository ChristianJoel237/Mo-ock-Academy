import { useState, useEffect } from "react";
import Note from "./components/Note";
import "./index.css";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import axios from "axios";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("...");

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/notes")
      .then((result) => {
        setNotes(result.data);
      })
      .catch((erreur) => console.log("il y a eu un probleme:", erreur));
  }, []);

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);
  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  const handleDelete = (id) => {
    if (confirm("Are you want to delete this note?")) {
      noteService.remove(id).then((result) => {
        const newNotes = notes.filter((note) => note.id != id);
        setNotes(newNotes);
        setErrorMessage("you are Deleted a note");
    
      });
    }
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((result) => {
        setNotes(notes.map((note) => (note.id !== id ? note : result)));
      })
      .catch((error) => {
        console.log("erreur:", error);
        setErrorMessage(`la modification a  echoué sur le serveur  `);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
            handleDelete={handleDelete}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
          placeholder="ajoutez une note"
        />
        <button type="submit">save</button>{" "}
      </form>
      <Footer />
    </div>
  );
};

export default App;
