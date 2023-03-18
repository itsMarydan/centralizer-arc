import CleanJobs from "../classes/clean_jobs_class";

export function cleanContentJob(database, collection) {
    console.log("[NUB]","Clean Content Database Job Started");
    console.log("[NUB]","Database: ", database);
    console.log("[NUB]","Collection: ", collection);
    let cleanCollectionData = new CleanJobs(database, collection);
    cleanCollectionData.cleanCollectionData();
    console.log("[NUB]","Clean Content Data Job Done");
    let cleanCollection = new CleanJobs(database, collection);
    cleanCollection.cleanCollection().then((result) => {
        console.log("[NUB]","Clean Content Job Done");
        console.log("[MONGO_CLIENT]::","[INFO]",`The provided rules have been registered successfully!`);
        client.close();
    })
    console.log("[NUB]","Clean Content Job Done");
}


