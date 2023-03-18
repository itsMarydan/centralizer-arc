import CleanJobs from "../classes/clean_jobs_class";
import CleanInfrastructure from "../methods/clean_infrastructure";

// Route to clean a collection Data by Database and Collection Name
export const cleanCollectionData = {
    method: 'delete',
    path: '/api/clean/collection-data/:database/:collection',
    handler: async (req, res) => {
        let database = req.params.database;
        let collection = req.params.collection;
        let cleanJobs = new CleanJobs(database,collection);
        console.log("[MONGO_CLIENT]::","[INFO]",`Clean Collection Data Job for ${database} collection ${collection}`);
        try {
            await cleanJobs.cleanCollectionData();
           return  res.status(200).send({message: `All Data for  ${collection} Deleted`});
        }catch (e) {
            return res.status(500).send({message: e.message});
        }
    }
}

// Route to clean a collection by Database and Collection Name
export const cleanCollection = {
    method: 'delete',
    path: '/api/clean/collection/:database/:collection',
    handler: async (req, res) => {
        let database = req.params.database;
        let collection = req.params.collection;
        let cleanJobs = new CleanJobs(database,collection);
        console.log("[MONGO_CLIENT]::","[INFO]",`Clean Collection Job for ${database} collection ${collection}`);
        try {
            await cleanJobs.cleanCollection();
            return res.status(200).send({message: `The collection ${collection}, was Deleted`});
        }catch (e) {
            return res.status(500).send({message: e.message});
        }
    }
}

// Route to clean a database by Database Name
export const cleanDatabase = {
    method: 'delete',
    path: '/api/clean/database/:database',
    handler: async (req, res) => {
        let database = req.params.database;
        let cleanJobs = new CleanJobs(database,"");
        console.log("[MONGO_CLIENT]::","[INFO]",`Clean Database Job for ${database}`);
        try {
            await cleanJobs.cleanDatabase();
            return res.status(200).send({message: `The database ${database}, was Deleted`});
        }catch (e) {
            return res.status(500).send({message: e.message});
        }
    }
}


// Route to clean a content by appSlug and slug
export const cleanContent = {
    method: 'delete',
    path: '/api/clean/content/:appSlug/:slug',
    handler: async (req, res) => {
        let appSlug = req.params.appSlug;
        let slug = req.params.slug;
        let cleanContent = new CleanInfrastructure(appSlug,slug);
        console.log("[MONGO_CLIENT]::","[INFO]",`Clean Content Job for ${appSlug} content ${slug}`);
        try {
            await cleanContent.cleanContent();
            return res.status(200).send({message: `The content ${slug}, was Deleted`});
        }catch (e) {
            return res.status(500).send({message: e.message});
        }
    }
}