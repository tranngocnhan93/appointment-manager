import { config } from './public/config.js';
import { getDB, getPrimaryKey, connect } from './db.js';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const collection = config.db.collection;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('public'))
app.use(express.static('./methods-public'));


app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});
app.get('/timetable', (req,res) => {
    res.sendFile(path.join(__dirname,'timetable.html'));
});

app.get('/getAppointments', (req,res) => {
    const db = getDB().collection(collection).find({}).toArray((err,documents) => {
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
    
    const db = getDB().collection(collection).insertOne(userInput, (err,result) => {
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

    const db = getDB();
    db.collection(collection).findOneAndUpdate({_id: getPrimaryKey(appointmentID)}, {$set : 
        {customer : userInput.customer, technician : userInput.technician, date : userInput.date, place : userInput.place}}, {returnOriginal : false}, (err, result) => {
        if(err)
            console.log(err);
        else
            res.json(result);

    });
});

app.delete('/delete/:id', (req,res) => {
    const appointmentID = req.params.id;

    const db = getDB();
    db.collection(collection).findOneAndDelete({_id : getPrimaryKey(appointmentID)}, (err,result) => {
        if(err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});

const db = connect((err) => {
    if(err) {
        console.log('Unable to connect to database');
        process.exit(1);
    }
    else {
        app.listen(config.app.port, () => {
            console.log('Connected to database, app listening to port ' + config.app.port);
        });
    }
})
