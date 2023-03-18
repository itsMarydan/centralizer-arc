import mongoConnect from "../mongodb/client";
import {cleanContentJob} from "./clean_content";
import {underscore} from "../helper/case-convert";
import pluralize from "pluralize";
export default class CleanInfrastructure{
    get slug() {
        return this._slug;
    }

    set slug(value) {
        this._slug = value;
    }

    constructor(appSlug, slug) {
        this._appSlug = appSlug;
        this._appDatabase = `bc-${appSlug}`;
        this._slug = slug;
    }


    get appSlug() {
        return this._appSlug;
    }

    set appSlug(value) {
        this._appSlug = value;
    }

    get appDatabase() {
        return this._appDatabase;
    }

    set appDatabase(value) {
        this._appDatabase = value;
    }


    cleanSchema(){
        mongoConnect(async (client) => {
            let collection = client.db(process.env.DB_NAME).collection(process.env.SCHEMA_COLLECTION);
            const query = {slug: this.slug};
            await collection.deleteOne(query).catch((error) => {
                console.log( "[MONGO_CLIENT]::", "[ERROR]::" ,error);
            }).then(result => {
                client.close();
                console.log("[MONGO_CLIENT]::","[INFO]",`Client Closed!`);
            });
        }).then(result => {}).catch(error => {
            console.log( "[MONGO_CLIENT]::", "[ERROR]::" ,error);
        });
    }

    cleanBuilder(){
        mongoConnect(async (client) => {
            let collection = client.db(process.env.DB_NAME).collection(process.env.BUILDER_COLLECTION);
            const query = {slug: this.slug};
            await collection.deleteOne(query).catch((error) => {
                console.log( "[MONGO_CLIENT]::", "[ERROR]::" ,error);
            }).then(result => {
                client.close();
                console.log("[MONGO_CLIENT]::","[INFO]",`Client Closed!`);
            });;
        }).then(result => {}).catch(error => {
            console.log( "[MONGO_CLIENT]::", "[ERROR]::" ,error);
        });
    }

    cleanContent(){
        console.log(this.appSlug, "App Slug");
        console.log("[NUB]","Cleaning Content");
        this.cleanSchema();
        console.log("[NUB]","Clean Schema Job Done");
        this.cleanBuilder();
        console.log("[NUB]","Cleaning Builder Job Done");
        cleanContentJob(this.appDatabase, underscore(pluralize(this.slug)));
        console.log("[NUB]","Clean Content Job End");
    }
}