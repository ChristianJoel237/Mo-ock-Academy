const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <fieldset>
      <legend><h2><b>Add a new Person</b></h2></legend>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div><br/>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div><br/>
        <button type="submit">add</button>
      </form>
    </fieldset>
  );
};

export default PersonForm;
