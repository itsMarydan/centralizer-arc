import mongoConnect from "../client";

export async function loadRoles(rolesJson) {
    mongoConnect(async (client) => {
        let database = await client.db(process.env.DB_NAME);
        let collection = await database.collection(process.env.ROLES_COLLECTION);
        await collection.insertMany(rolesJson).then((result) => {
            console.log("[MONGO_CLIENT]::","[INFO]",`The provided roles have been registered successfully!`, result);
        }).then(()=>{
            console.log("[MONGO_CLIENT]::","[INFO]",`The provided roles have been registered successfully!`);
            client.close();
            console.log("[MONGO_CLIENT]::","[INFO]",`Client Closed!`);

        }).catch((error) => {
            console.log("[MONGO_CLIENT]::","[ERROR]", "Load Roles Job",error);
        });
    }).then(result => {
        console.log("[MONGO_CLIENT]::","[RESULT]", "Load Roles Job",result);
    }).catch(error => {
        console.log("[MONGO_CLIENT]::","[ERROR]", "Load Roles Job",error);
    }).finally(() => {
        console.log("[MONGO_CLIENT]::","[INFO]", "Load Roles Job","Job Completed");
    });
}