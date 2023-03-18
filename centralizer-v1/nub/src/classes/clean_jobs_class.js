import mongoConnect from "../mongodb/client";

export default  class CleanJobs{

    constructor(database,collectionName) {
        this._database = database;
        this._collectionName = collectionName;
    }

    get database() {
        return this._database;
    }

    set database(value) {
        this._database = value;
    }

    get collectionName() {
        return this._collectionName;
    }

    set collectionName(value) {
        this._collectionName = value;
    }


    cleanCollectionData(){
        mongoConnect((client) => {
            let collection = client.db(this.database).collection(this.collectionName);
            collection.deleteMany({}).then((result) => {
                console.log(`All Contents for  ${this.collectionName} Deleted`);
            }).catch((error) => {
                console.log(error);
                console.log("[MONGO_CLIENT]::","[ERROR]", "Clean All Collection Data Job",error);
            });
        }).then(result => {
            console.log("[MONGO_CLIENT]::","[RESULT]", "Clean All Collection Data Job",result);
        }).catch(error => {
            console.log("[MONGO_CLIENT]::","[ERROR]", "Clean All Collection Data Job",error);

        });
    }

    cleanCollection(){
        mongoConnect((client) => {
            let collection = client.db(this.database).collection(this.collectionName);
            collection.drop().then((result) => {
                console.log("[MONGO_CLIENT]::","[INFO]",`The Collection ${this.collectionName}, was Deleted`);
            }).catch((error) => {
                console.log("[MONGO_CLIENT]::","[ERROR]", "Clean Collection Job",error);
            });
        }).then(result => {
            console.log("[MONGO_CLIENT]::","[RESULT]", "Clean Collection Job",result);
        }).catch(error => {
            console.log("[MONGO_CLIENT]::","[ERROR]", "Clean Collection Job",error);
        });
    }

    cleanDatabase(){
        mongoConnect((client) => {
            let database = client.db(this.database);
            database.dropDatabase().then((result) => {
                console.log("[MONGO_CLIENT]::","[INFO]",`The ${this.database}, was Deleted`);
            }).catch((error) => {
                console.log("[MONGO_CLIENT]::","[ERROR]", "Clean Database Job",error);
            });
        }).then(result => {
            console.log("[MONGO_CLIENT]::","[RESULT]", "Clean Database Job",result);
        }).catch(error => {
            console.log("[MONGO_CLIENT]::","[ERROR]", "Clean Database Job",error);
        });
    }
}