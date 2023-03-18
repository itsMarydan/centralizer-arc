import mongoose from "mongoose-client";

const config = require('../../config')['environment'];
const uri = `mongodb://${config.db.mongo.mongoUser}:${config.db.mongo.mongoPwd}@${config.db.mongo.mongoHostname}:${config.db.mongo.mongoPort}/${config.db.mongo.mongoDb}?authSource=admin`;
mongoose.Promise = global.Promise;

mongoose.connect(uri, {useNewUrlParser: true}, function (error){
    if(error){
        console.log('error connecting to the database', error);
        process.exit();
    }else{
        console.log('successfully connected to the database');
    }
})
export const mongooseDb = mongoose.connection.useDb(config.db.mongo.mongoDb);