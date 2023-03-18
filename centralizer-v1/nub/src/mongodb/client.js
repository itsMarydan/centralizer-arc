const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
// const uri =  process.env.MONGO_CLIENT_CONNECT || "mongodb+srv://blueadmin:blueadmin2021@cluster0.1g2r0.mongodb.net";


const config = require('../config')['environment'];
const uri = `mongodb://${config.db.mongo.mongoUser}:${config.db.mongo.mongoPwd}@${config.db.mongo.mongoHostname}:${config.db.mongo.mongoPort}/${config.db.mongo.mongoDb}?authSource=admin`;
const mongoConnect = async (operations) => {
    const client = new MongoClient(uri);
    try {
        console.log("[MONGODB_CLIENT]","Connected correctly to server");
        await operations(client);
    }catch (err) {
        console.log(err);
    }finally {
        // await client.close();
    }
}

module.exports = mongoConnect;