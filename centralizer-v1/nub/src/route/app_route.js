import {logger} from "../logger/winson";
import Application from "../classes/app_class";


export const createApplication = {
    path: '/api/create-app',
    method: 'post',
    handler: async (req, res) => {
        const {appName, appStatus, createdBy} = req.body;
        try {
            const app = new Application(appName,appStatus, [], createdBy);
            console.log(app)
           const create = await app.create();
              console.log(create)
        } catch (err) {
            logger.error('handle request create new application', {req, res, error: err});
        }
        logger.info('handle request create new application', {req, res, info: "Success!"});
        return res.status(200).json({message: "Success!"})
    }
};
export const updateApplication = {
    path: '/api/update-app/:appSlug',
    method: 'put',
    handler: async(req, res) => {
        const appSlug = req.params.appSlug;
        const updates = req.body;
        updates["lastModified"] = new Date();
        try {
            const app = new Application();
            app.appSlug = appSlug;
            await app.update(updates)
        }catch(err){
            logger.error(`handle update app request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
        logger.info(`handle update app request`, {req, res, info: `app was updated successfully!!`});
        return res.status(200).json({message: "Success!"})
    }
};
export const getApplication = {
    path: '/api/app/:appSlug',
    method: 'get',
    handler: async (req, res) => {
        const appSlug = req.params.appSlug;
        try {
            const app = new Application();
            app.appSlug = appSlug;
            const retrievedValue = await  app.getBySlug();
            logger.info(`handle get app request`, {req, res, info: `app was found successfully!!`});
            return res.status(200).json(retrievedValue);
        } catch (err) {
            logger.error(`handle get app request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }

    }
}
export const getAllApplication = {
    path: '/api/apps',
    method: 'get',
    handler: async (req, res) => {
        try {
            console.log("here 1")
            const app = new Application();
            const retrievedValue = await app.getAll();
            console.log("here 2", retrievedValue)
            logger.info(`handle get all apps request`, {req, res, info: `apps found successfully!!`});
            return res.status(200).json(retrievedValue);
        } catch (err) {
            console.log(err)
            logger.error(`handle get all apps request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }

    }
}
export const getApplicationsByRole = {
    path: '/api/apps-by-role/:role',
    method: 'get',
    handler: async (req, res) => {
        try {
            const roleIdentifier = req.params.role;
            const app = new Application();
            const permittedApps = await app.getAllByRole(roleIdentifier);
            logger.info ( `handle get all permitted apps request`, {req, res, info: `apps found successfully!!`} );
            return res.status ( 200 ).json ( permittedApps );
        } catch (err) {
            logger.error ( `handle get all apps request`, {req, res, error: err} );
            return res.status ( 500 ).json ( {message: `An error Occurred!: \r\n ${err}`} )
        }

    }
}
export const deleteApplication = {
    path: '/api/delete-app/:appSlug',
    method: 'delete',
    handler: async(req, res) => {
        const appSlug = req.params.appSlug;

        try {
            const app = new Application();
            app.appSlug =appSlug;
            await app.hardDelete();
        }catch(err){
            logger.error(`handle delete app request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
        logger.info(`handle delete app request`, {req, res, info: `app was deleted successfully!!`});
        return res.status(200).json({message: "Success!"})
    }
}
export const softDeleteApplication = {
    path: '/api/soft-delete-app/:appSlug',
    method: 'put',
    handler: async(req, res) => {
        const appSlug = req.params.appSlug;

        try {
            const app = new Application();
            app.appSlug = appSlug;
            console.log(app)
            await  app.softDelete();
        }catch(err){
            logger.error(`handle delete app request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
        logger.info(`handle delete app request`, {req, res, info: `app was deleted successfully!!`});
        return res.status(200).json({message: "Success!"})
    }
}
