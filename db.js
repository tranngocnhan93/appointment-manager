const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('bson').ObjectID;
const dbname = "appointments_db"
const url = "mongodb://localhost:27017";
const mongoOptions = {useNewUrlParser : true};

const connectionStatus = {
    db : null
}

const connect = (cb) => {
    if (connectionStatus.db) {
        console.log('db already active')
        cb();
    }
    else {
        MongoClient.connect(url, mongoOptions, (err,client) => {
            if(err) {
                console.log(err)
                cb(err);
            }
            else {
                connectionStatus.db = client.db(dbname);
                cb();
            }
        });
    }
};

const getPrimaryKey = (_id) => {
    return ObjectId(_id);
};

const getDB = () => {
    return connectionStatus.db;
};

module.exports = {getDB, getPrimaryKey, connect};