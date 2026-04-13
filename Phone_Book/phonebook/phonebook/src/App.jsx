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

  // pour mes motification
  const showNotification = (message, type) => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // pour recuperer mes donnnes
  useEffect(() => {
    axios
      .get("api/persons")
      .then((response) => {
        setPersons(response.data);
      })
      .catch((error) => {
        console.error("Erreur de chargement :", error);
        showNotification(" Erreur de connexion au serveur", "error");
      });
  }, []);

  // Gestion devenement
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  const validateFields = () => {
    if (newName.trim() === "") {
      showNotification(" the name can be empty", "error");
      return false;
    }
    if (newNumber.trim() === "") {
      showNotification(" the number can be empty", "error");
      return false;
    }
    return true;
  };

  //pout  Ajouter et mettre à jour une personne
  const addPerson = (event) => {
    event.preventDefault();

    if (!validateFields()) return;

    // si le non existe deja
    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    );

    if (existingPerson) {
      // demande si i can replace
      const confirmReplace = window.confirm(
        `${newName} is already exist, replace by the old number ?`,
      );

      if (confirmReplace) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        axios
          .put(
            `/api/persons/${existingPerson.id}`,
            updatedPerson,
          )
          .then((response) => {
            setPersons(
              persons.map((p) =>
                p.id === existingPerson.id ? response.data : p,
              ),
            );
            setNewName("");
            setNewNumber("");
            showNotification(` ${newName} was update !`, "success");
          })
          .catch((error) => {
            console.error("Erreur mise à jour :", error);
            showNotification(`${error.response.data.error}`, "error");
          });
      }
      return;
    }

    //  nouveau contact
    const newPerson = {
      name: newName,
      number: newNumber,
      id: Date.now(),
    };

    axios
      .post("api/persons", newPerson)
      .then((response) => {
        setPersons(persons.concat(response.data));
        setNewName("");
        setNewNumber("");
        showNotification(` ${newName} a été ajouté !`, "success");
      })
      .catch((error) => {
        console.log(error);
       
       showNotification(`${error.response.data.error}`,"error");
      });
  };
  // Supprimer une personne
  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);

    if (window.confirm(`Supprimer ${person.name} ?`)) {
      axios
        .delete(`api/persons/${id}`)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          showNotification(` ${person.name} a été supprimé`, "success");
        })
        .catch((error) => {
          console.error("Erreur suppression :", error);
          showNotification(` Erreur lors de la suppression`, "error");
        });
    }
  };

  // Modifier le numero d'une personne
  const updateNumber = (id, currentNumber) => {
    const newNumber = window.prompt("Nouveau numéro :", currentNumber);

    if (newNumber === null) return; // Annule par l'utilisateur

    if (newNumber.trim() === "") {
      showNotification(" Le numéro ne peut pas être vide", "error");
      return;
    }

    if (newNumber !== currentNumber) {
      const updatedPerson = {
        ...persons.find((p) => p.id === id),
        number: newNumber,
      };

      axios
        .put(`/api/persons/${id}`, updatedPerson)
        .then((response) => {
          setPersons(persons.map((p) => (p.id === id ? response.data : p)));
          showNotification(
            ` Numéro de ${response.data.name} modifié !`,
            "success",
          );
        })
        .catch((error) => {
          console.error("Erreur modification :", error);
          showNotification(`${error.response.data.error}`,"error");
        });
    }
  };

  // Filtrer les personnes selon la recherche
  const personsToShow =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase()),
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
