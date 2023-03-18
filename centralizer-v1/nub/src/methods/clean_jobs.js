import mongoConnect from "../mongodb/client";
import CleanJobs from "../classes/clean_jobs_class";

export async function cleanCollectionData(database, collection) {
    let cleanJobs = new CleanJobs(database, collection);
    console.log("[MONGO_CLIENT]::", "[INFO]", `Clean Collection Data Job for ${database} collection ${collection}`);
    try {
        await cleanJobs.cleanCollectionData();
        console.log("[MONGO_CLIENT]::", "[INFO]",{message: `All Data for  ${collection} Deleted`});
    } catch (e) {
        console.log("[MONGO_CLIENT]::", "[ERROR]",{message: e.message});
    }
}

export async function cleanCollection(database, collection) {
    let cleanJobs = new CleanJobs(database, collection);
    console.log("[MONGO_CLIENT]::", "[INFO]", `Clean Collection Job for ${database} collection ${collection}`);
    try {
        await cleanJobs.cleanCollection();
        console.log("[MONGO_CLIENT]::", "[INFO]",{message: `The collection ${collection}, was Deleted`});
    } catch (e) {
        console.log("[MONGO_CLIENT]::", "[ERROR]",{message: e.message});
    }
}


export async function cleanDatabase(database) {
    let cleanJobs = new CleanJobs(database, "");
    console.log("[MONGO_CLIENT]::", "[INFO]", `Clean Database Job for ${database}`);
    try {
        await cleanJobs.cleanDatabase();
        console.log("[MONGO_CLIENT]::", "[INFO]",{message: `The database ${database}, was Deleted`});
    } catch (e) {
        console.log("[MONGO_CLIENT]::", "[ERROR]",{message: e.message});
    }
}