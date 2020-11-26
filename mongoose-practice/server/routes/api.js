const express = require('express');
const router = express.Router();
const Person = require('../models/Person.js');

router.get('/people', function(req, res){
    Person.find({}, function (err, people){
        res.send(people);
    });
});

router.post('/person', function(req, res){
    //should receive: firstname lastname age
    const request = req.body;
    const pSave = new Person({ firstName: request.firstName, lastName: request.lastName, age: request.age });
    pSave.save();
    res.send(pSave);
});

router.put('/person/:id', function(req, res){
    const request = req.params.id;
    Person.findByIdAndUpdate(request, {age: 80} , function (err, person){
        res.send(person);
    });
});

router.delete('/apocalypse', function(req, res){
    Person.deleteMany({}, function(err, person){
        res.send(person);
    });
});

module.exports = router;