const { MongoClient } = require("mongodb");



// Replace the uri string with your connection string.

// const { MONGO_USER, MONGO_PWD, MONGO_DB, MONGO_HOSTNAME, MONGO_PORT} = process.env;
const config = require('../../config')['environment'];
const uri = `mongodb://${config.db.mongo.mongoUser}:${config.db.mongo.mongoPwd}@${config.db.mongo.mongoHostname}:${config.db.mongo.mongoPort}/${config.db.mongo.mongoDb}?authSource=admin`;
// const uri =  process.env.MONGO_CLIENT_CONNECT || "mongodb+srv://blueadmin:blueadmin2021@cluster0.1g2r0.mongodb.net";
const mongoConnect = async (operations) => {
    console.log("mongoConnect url: ", uri);
    const client = new MongoClient(uri);
    try {
        console.log("[MONGODB_CLIENT]","Connected correctly to server");
        await operations(client);
    }catch (err) {
        console.log(err)
        console.log("[MONGODB_CLIENT]","Error connecting to server", uri);
    }
}

module.exports = mongoConnect;