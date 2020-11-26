const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/peopleDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const personSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: String,
    age: Number
});

const Person = mongoose.model("person", personSchema, 'persons');

module.exports = Person;