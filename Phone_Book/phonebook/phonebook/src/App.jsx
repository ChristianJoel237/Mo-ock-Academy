import { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");

  // Notifications
  const showNotification = (message, type) => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 5000);
  };

  // Chargement initial des données
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/persons")
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setPersons(data);
      })
      .catch((error) => {
        console.error("Erreur de chargement :", error);
        showNotification("Erreur de connexion au serveur", "error");
      });
  }, []);

  // Gestion des événements
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  const validateFields = () => {
    if (newName.trim() === "") {
      showNotification("Le nom ne peut pas être vide", "error");
      return false;
    }
    if (newNumber.trim() === "") {
      showNotification("Le numéro ne peut pas être vide", "error");
      return false;
    }
    return true;
  };

  // Ajouter ou mettre à jour une personne
  const addPerson = (event) => {
    event.preventDefault();

    if (!validateFields()) return;

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${newName} existe déjà, remplacer par le nouveau numéro ?`
      );

      if (confirmReplace) {
        axios
          .put(`http://localhost:3001/api/persons/${existingPerson.id}`, {
            ...existingPerson,
            number: newNumber,
          })
          .then((response) => {
            setPersons(
              persons.map((p) =>
                p.id === existingPerson.id ? response.data : p
              )
            );
            setNewName("");
            setNewNumber("");
            showNotification(`${newName} a été mis à jour !`, "success");
          })
          .catch((error) => {
            console.error("Erreur mise à jour :", error);
            const msg =
              error.response?.data?.error || "Erreur lors de la mise à jour";
            showNotification(msg, "error");
          });
      }
      return;
    }

    // Nouveau contact
    axios
      .post("http://localhost:3001/api/persons", { name: newName, number: newNumber })
      .then((response) => {
        setPersons(persons.concat(response.data));
        setNewName("");
        setNewNumber("");
        showNotification(`${newName} a été ajouté !`, "success");
      })
      .catch((error) => {
        console.error("Erreur ajout :", error);
        const msg =
          error.response?.data?.error || "Erreur lors de l'ajout";
        showNotification(msg, "error");
      });
  };

  // Supprimer une personne
  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (!person) return;

    if (window.confirm(`Supprimer ${person.name} ?`)) {
      axios
        .delete(`http://localhost:3001/api/persons/${id}`)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          showNotification(`${person.name} a été supprimé`, "success");
        })
        .catch((error) => {
          console.error("Erreur suppression :", error);
          showNotification("Erreur lors de la suppression", "error");
        });
    }
  };

  // Modifier le numéro d'une personne
  const updateNumber = (id, currentNumber) => {
    const newNum = window.prompt("Nouveau numéro :", currentNumber);

    if (newNum === null) return;

    if (newNum.trim() === "") {
      showNotification("Le numéro ne peut pas être vide", "error");
      return;
    }

    if (newNum !== currentNumber) {
      const updatedPerson = {
        ...persons.find((p) => p.id === id),
        number: newNum,
      };

      axios
        .put(`http://localhost:3001/api/persons/${id}`, updatedPerson)
        .then((response) => {
          setPersons(persons.map((p) => (p.id === id ? response.data : p)));
          showNotification(
            `Numéro de ${response.data.name} modifié !`,
            "success"
          );
        })
        .catch((error) => {
          console.error("Erreur modification :", error);
          const msg =
            error.response?.data?.error || "Erreur lors de la modification";
          showNotification(msg, "error");
        });
    }
  };

  // Filtrer les personnes
  const personsToShow =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <div>
      <Notification message={notification} type={notificationType} />

      <legend>
        <h1>PhoneBook</h1>
      </legend>

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>
        <u>Name & Numbers:</u>
      </h3>

      <Persons
        personsToShow={personsToShow}
        handleDelete={deletePerson}
        handleUpdate={updateNumber}
      />
    </div>
  );
};

export default App;