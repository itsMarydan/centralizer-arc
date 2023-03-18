import mongoConnect from "../client";

export async function loadPolicies(policiesJson) {
    mongoConnect(async (client) => {
        let database = await client.db(process.env.DB_NAME);
        let collection = await database.collection(process.env.POLICIES_COLLECTION);
        await collection.insertMany(policiesJson).then((result) => {
            console.log("[MONGO_CLIENT]::","[INFO]",`The provided policies have been registered successfully!`, result);
        }).then(()=>{
            console.log("[MONGO_CLIENT]::","[INFO]",`The provided policies have been registered successfully!`);
            client.close();
            console.log("[MONGO_CLIENT]::","[INFO]",`Client Closed!`);

        }).catch((error) => {
            console.log("[MONGO_CLIENT]::","[ERROR]", "Load Policies Job",error);
        });
    }).then(result => {
        console.log("[MONGO_CLIENT]::","[RESULT]", "Load Policies Job",result);
    }).catch(error => {
        console.log("[MONGO_CLIENT]::","[ERROR]", "Load Policies Job",error);
    }).finally(() => {
        console.log("[MONGO_CLIENT]::","[INFO]", "Load Policies Job","Job Completed");
    });
}