const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'))
const path = require('path');

const db = require("./db.js");
const collection = "appointment"

app.use(express.static('./methods-public'));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});
app.get('/timetable', (req,res) => {
    res.sendFile(path.join(__dirname,'timetable.html'));
});

app.get('/getAppointments', (req,res) => {
    db.getDB().collection(collection).find({}).toArray((err,documents) => {
        if(err)
            console.log(err);
        else {
            console.log(documents);
            res.json(documents);
        }
    });
});

app.post('/createAppointment', (req,res) => {
    const userInput = req.body;
    
    db.getDB().collection(collection).insertOne(userInput, (err,result) => {
        if(err)
            console.log(err);
        else {
            res.json(result);
        }
    });
})

// Update based on customer name
app.put('/update/:id', (req,res) => {
    const appointmentID = req.params.id;
    const userInput = req.body;

    db.getDB().collection(collection).findOneAndUpdate({_id: db.getPrimaryKey(appointmentID)}, {$set : 
        {customer : userInput.customer, technician : userInput.technician, date : userInput.date, place : userInput.place}}, {returnOriginal : false}, (err, result) => {
        if(err)
            console.log(err);
        else
            res.json(result);

    });
});

app.delete('/delete/:id', (req,res) => {
    const appointmentID = req.params.id;

    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(appointmentID)}, (err,result) => {
        if(err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});

db.connect((err) => {
    if(err) {
        console.log('Unable to connect to database');
        process.exit(1);
    }
    else {
        app.listen(3000, () => {
            console.log('Connected to database, app listening to port 3000');
        });
    }
})
