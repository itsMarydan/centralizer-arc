import {HEADER_ROLE} from "../enums/role_types";
import {permissionValidation} from "../external/external_retriever";
import Application from "../classes/app_class";
import {FormBuilderSchema, FormSchemaTemplates} from "../database/db_schemas";
import {kebab} from "../helper/case-convert";
import {logger} from "../logger/winson";

export const createFormSchemaTemplate = {
    path: '/api/:appSlug/create-form-schema',
    method: 'post',
    handler: async (req, res) => {
        const appSlug = req.params.appSlug;
        const {slug, schemaTypes, identifier} = req.body;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug  );

        if ( permission ) {
            //retrieve application information
            const anApp =  new Application();
            anApp.appSlug = appSlug;
            const app = await anApp.getBySlug();
            schemaTypes.push({name: "publishedOn", type:"Date"});
            schemaTypes.push({name: "createdOn", type:"Date"});
            schemaTypes.push({name: "lastUpdate", type:"Date"});
            schemaTypes.push({name: "contentStatus", type:"Boolean"});
            schemaTypes.push({name: "createdBy", type:"Number"});

            if(app){
                console.log(app)
                const schemaName = `${app.appId.toLowerCase()}_${slug.toLowerCase()}`
                //create and save schema
                try {
                    const newSchema = new FormSchemaTemplates({
                        slug: kebab(slug),
                        schemaName: schemaName,
                        schemaTypes: schemaTypes,
                        identifier: identifier,
                        appSlug: appSlug
                    });
                    await newSchema.save().then(() => {
                            logger.info('handle method save schema', {info: `schema was sent successfully!!`})
                        }
                    )

                } catch (err) {
                    logger.error('handle request create schema template', {req, res, error: err});
                    res.status ( 200 ).json ( {
                        status: 400,
                        message: "Create schema Failed",
                        error: `Error Occurred on Create`,
                        type: "Create Failed",
                        description: `Unable to create Schema Due to Error`,
                    } )
                }

                try{

                    console.log( {
                        slug: kebab(slug), appSlug: appSlug
                    })

                    const builder = await FormBuilderSchema.updateOne ( {
                        slug: kebab(slug), appSlug: appSlug
                    }, {isPublished: true} ).exec ().then ();
                    console.log(builder)
                }catch(err) {
                    logger.error('handle request create schema template', {req, res, error: err});
                    res.status ( 200 ).json ( {
                        status: 400,
                        message: "Builder Update Failed",
                        error: `Error Occurred on Builder Update`,
                        type: "Update Failed",
                        description: `Unable to update Builder Status to published Due to Error`,
                    } )
                }

                logger.info('handle request create schema template', {req, res, info: "Success!"});
                return res.status(200).json({status: 200, message: "Success!"})
            }else{
                logger.info ( `handle create schema request`, {
                    req,
                    res,
                    message: "Create schema Failed",
                    error: `Not permitted`,
                    type: "application retrieval error",
                    description: `the application specified does not exist or cannot be located check system management logs`
                } );
                res.status ( 200 ).json ( {
                    status: 400,
                    message: "Create schema Failed",
                    error: `Not permitted`,
                    type: "application retrieval error",
                    description: `the application specified does not exist or cannot be located check system management logs`,
                } )
            }
        }else{
            logger.error ( `handle create schema request`, {
                req,
                res,
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`
            } );
            res.status ( 200 ).json ( {
                status: 400,
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`,
            } )
        }
    }
};
export const getFormSchema = {
    path: '/api/:appSlug/form-schema/:slug',
    method: 'get',
    handler: async (req, res) => {
        const slug = req.params.slug;
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug  );

        if ( permission ) {
            try {
                const schema = await FormSchemaTemplates.findOne({slug: slug, appSlug: appSlug}).exec();
                logger.info('handle request get schema', {req, res, info: "Schema Found successfully!!!"});
                return res.status(200).json(schema);
            } catch (err) {
                logger.error('handle request get schema', {req, res, error: err})
                return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
            }
        }else{
            logger.error ( 'handle request get schema', {
                req,
                res,
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`
            } );
            res.status ( 400 ).json ( {
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`,
            } )
        }
    }
};
export const getFormSchemasByApplication = {
    path: '/api/:appSlug/form-schemas',
    method: 'get',
    handler: async (req, res) => {
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];

        //access validation
        const permission = permissionValidation ( role, appSlug );
        if(permission){
            try {
                const schema = await FormSchemaTemplates.find({appSlug: appSlug}).exec();
                logger.info('handle request get all schemas', {req, res, info: "Schema Found successfully!!!"});
                return res.status(200).json(schema);
            } catch (err) {
                logger.error('handle request get all schemas', {req, res, error: err})
                return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
            }
        }else{
            logger.error ( 'handle request get all schemas', {
                req,
                res,
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`
            } );
            res.status ( 400 ).json ( {
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`,
            } )
        }
    }
};
export const getAllFormSchemas = {
    path: '/api/form-schemas',
    method: 'get',
    handler: async (req, res) => {
        try {
            const schema = await FormSchemaTemplates.find().exec();
            logger.info('handle request get all schemas', {req, res, info: "Schema Found successfully!!!"});
            return res.status(200).json(schema);
        } catch (err) {
            logger.error('handle request get all schemas', {req, res, error: err})
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }

    }
};