const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Expense = require('../models/Expense.js');
const moment = require('moment');

mongoose.connect('mongodb://localhost/expensesDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

//run only one time
// (function loadJSON(){
//     //amount, group, date, item
//     const jsonData = require('../../expenses.json');
//     jsonData.forEach(data => new Expense({amount: data.amount, group: data.group, date: data.date, item: data.item}).save());
// })();

router.get('/expenses', function(req, res){
    Expense.find({}).sort({date:-1}).exec(function(err, expense){
        res.send(expense);
    });
});

router.get('/expenses/:group', function(req, res){
    const request = req.params;
    const total = req.query.total;
    if (total){
        Expense.aggregate(
            [
                {
                    $group: {
                        _id: "$item",
                        total: {$sum: "$amount"}
                    }
                }
            ],
            function(err, result){
                if (err){
                    res.send(err);
                }
                else{
                    res.json(result);
                }
            }
        );
    }
    else{
        const d1 = req.query.d1;
        const d2 = req.query.d2;
        if (!d1 && !d2){
            //both null d1 + d2
            Expense.find({group: request.group}, {}).exec(function(err, expense){
                res.send(expense);
            });
        }
        else{
            let getFirstDate = moment(d1).format("LLLL");
            let getSecondDate;
            if (!d2){
                //d2 null
                getSecondDate = moment(new Date()).format("LLLL");
            }
            else{
                //we got both d1 + d2
                getSecondDate = moment(d2).format("LLLL");
            }

            Expense.aggregate(
                [
                    {
                        $match: {
                            date: { $gte: new Date(getFirstDate), $lt: new Date(getSecondDate) }
                        }
                    }
                ],
                function(err, result){
                    if (err){
                        res.send(err);
                    }
                    else{
                        res.json(result);
                    }
                }
            );
        }
    }
});

router.post('/expense', function(req, res){
    //should receive: item, amount, group   (the previously used groups are "fun", "food", "rent", "bills" and "misc")
    //date is optional (so we need to check it)
    const request = req.body;
    let getDate = request.date;
    const eSave = new Expense({amount: request.amount, group: request.group, item: request.item});

    if (getDate)
        getDate = moment(getDate).format("LLLL");
    else
        getDate = moment(new Date()).format("LLLL");

    eSave.date = getDate;
    eSave.save().then(console.log(`Amount of expense: ${eSave.amount} spent on ${eSave.item}`));
    res.send(eSave);
});

router.put('/update/:group1/:group2', function(req, res){
    //the previously used groups are "fun", "food", "rent", "bills" and "misc"
    const request = req.params;
    //console.log(request.group1);

    // Expense.find({group:request.group1}, {item: 1, _id: 1}).exec(function(err, myexpense){
    //     res.send(myexpense);
    // });
    // Expense.findByIdAndUpdate(request, {item: 80} , function (err, result){

    Expense.findOneAndUpdate({ group: request.group1 }, { group: request.group2 }, function(err, result){
        if (err){
            res.send(err);
        }
        else{
            res.json({item: result.item, group: result.group});
        }
    });

    // Expense.updateMany({ group: request.group1 }, { group: request.group2 }, function(err,result){
    //     if (err){
    //         res.send(err);
    //     }
    //     else{
    //         res.json(result);
    //     }
    // });
});

router.delete('/apocalypse', function(req, res){
    Expense.deleteMany({}, function(err, person){
        res.send(person);
    });
});

module.exports = router;