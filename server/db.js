import { config } from './public/config.js';
import { MongoClient } from 'mongodb/lib/mongo_client.js';
import { ObjectId } from 'bson/lib/objectid.js';

const dbname = config.db.name;
const url = `mongodb://${config.db.host}:${config.db.port}`;
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

export { getDB, getPrimaryKey, connect };