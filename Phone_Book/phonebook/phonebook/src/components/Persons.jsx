const Persons = ({ personsToShow, handleDelete, handleUpdate }) => {
  return (
    <ul>
      {personsToShow.map((person) => (
        <li key={person.id}>
          {person.name} : {person.number}
          <button onClick={() => handleDelete(person.id)} >supprimer</button>
          <button onClick={() => handleUpdate(person.id, person.number)}>
            modifier
          </button>{" "}
          <br />
          <br />
        </li>
      ))}
    </ul>
  );
};

export default Persons;
