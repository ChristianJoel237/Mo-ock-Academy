const mongoose = require('mongoose');

if (process.argv < 4) {
  console.log('number missing!');
  process.exit(1);
}

const url = process.MONGODB_URI;

mongoose.set('strictQuery', false);

mongoose.connect(url);
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 2) {
  Person.find({}).then((result) => {
    (result.forEach((person) => console.log(person)), mongoose.connection.close());
  });
} else {
  const newPerson = new Person({
    name: process.argv[2],
    number: process.argv[3],
  });

  newPerson
    .save()
    .then(
      () => console.log(`added ${process.argv[2]} number ${process.argv[3]} to  phonebook`),
      mongoose.connection.close()
    );
}
