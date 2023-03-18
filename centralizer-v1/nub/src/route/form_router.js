import {FormBuilderSchema, FormSchemaTemplates} from "../database/db_schemas";
import {logger} from "../logger/winson";
import {camelize} from "../helper/case-convert";
import {getUser, permissionValidation} from "../external/external_retriever";
import {buildNewEntry, buildSchema, buildSchemaTypes} from "../methods/builders";
import Application from "../classes/app_class";
import {HEADER_ROLE, USER_ID} from "../enums/role_types";
import {DATA_TYPE} from "../static/types.js";
const now = new Date ();

export const deleteForm = {
    path: '/api/:appSlug/delete-form/:form/:identifier',
    method: 'delete',
    handler: async (req, res) => {

        //retrieve variables
        const form = req.params.form; // where form is form-name
        const identifier = req.params.identifier;
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug  );

        if(!permission) {
            logger.error ( `handle delete ${form} request`, {
                req,
                res,
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`
            } );
            return res.status ( 400 ).json ( {
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`,
            } ) 
        }

        if ( permission ) {
            //retrieve schema
            const schema = await FormSchemaTemplates.findOne ( {slug: form, appSlug: appSlug} ).exec ();

            if ( schema ) {

                //initiate a schema json object and load data from the schema object authhub
                const schemaTypes = buildSchemaTypes ( schema );

                //retrieve application information
                const anApp =  new Application();
                anApp.appSlug = appSlug;
                const app = await anApp.getBySlug();

                if ( app ) {

                    //create schema
                    const FormSchema = buildSchema ( schemaTypes, app, form, DATA_TYPE.form.value);
                    //build filter and update json objects
                    const filter = {};
                    filter[schema.identifier] = identifier;
                    const updates = {'bcDelete': true, 'bcPublish': false};
                    // update item to show delete is true and formStatus is false
                    try {

                        await FormSchema.findOneAndUpdate( filter, updates );
                        logger.info ( `handle delete ${form} request`, {
                            req, res, info: `${form} was deleted successfully!!`
                        } );
                        return res.status ( 200 ).json ( {message: "Success!"} )
                    } catch (err) {
                        logger.error ( `handle delete ${form} request`, {req, res, error: err} );
                        return res.status ( 400 ).json ( {
                            error: "Failed to delete form", message: `An error Occurred!: \r\n ${err}`
                        } )
                    }

                }
                else {
                    logger.info ( `handle delete ${form} request`, {
                        req,
                        res,
                        message: "Delete Failed",
                        error: `Not permitted`,
                        type: "application retrieval error",
                        description: `the application specified does not exist or cannot be located check system management logs`
                    } );
                    return res.status ( 400 ).json ( {
                        message: "Delete Failed",
                        error: `Not permitted`,
                        type: "application retrieval error",
                        description: `the application specified does not exist or cannot be located check system management logs`,
                    } )
                }
            }
            else {
                logger.error ( `handle delete ${form} request`, {
                    req,
                    res,
                    message: "Delete Failed!",
                    error: `This entry could not be completed`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`
                } );
                return res.status ( 400 ).json ( {
                    message: "Delete Failed!",
                    error: `This entry could not be completed`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`,
                } )
            }
        }

    }
};
export const getForm = {
    path: '/api/:appSlug/get-form/:form/:identifier',
    method: 'get',
    handler: async (req, res) => {
        const form = req.params.form;
        const identifier = req.params.identifier;
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug  );
        console.log(form, "form");
        if(!permission) {
            logger.error ( `handle delete ${form} request`, {
                req,
                res,
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`
            } );
           return res.status ( 400 ).json ( {
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`,
            } )
        }
        if ( permission ) {

            //retrieve schema
            const schema = await FormSchemaTemplates.findOne ( {slug: form, appSlug: appSlug} ).exec ();

            if(!schema) {
                logger.error ( `handle get ${form} request`, {
                    req,
                    res,
                    message: "Retrieving Form Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`
                } )
                return res.status ( 400 ).json ( {
                    message: "Retrieving Form Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`,
                } )
            }

            if ( schema ) {

                const schemaTypes = buildSchemaTypes ( schema );
                //retrieve application information
                const anApp =  new Application();
                anApp.appSlug = appSlug;
                const app = await anApp.getBySlug();
                if(!app) {
                    logger.error ( `handle get ${form} request`, {
                        req,
                        res,
                        message: "Retrieving Form Failed",
                        error: `Not permitted`,
                        type: "application retrieval error",
                        description: `the application specified does not exist or cannot be located check system management logs`
                    } )
                   return res.status ( 400 ).json ( {
                        message: "Retrieving Form Failed",
                        error: `Not permitted`,
                        type: "application retrieval error",
                        description: `the application specified does not exist or cannot be located check system management logs`,
                    } )
                }
                if ( app ) {
                    //create schema
                    const FormSchema = buildSchema ( schemaTypes, app, form, DATA_TYPE.form.value);
                    //build filter
                    const filter = {};
                    filter[schema.identifier] = identifier;
                    filter ['bcDelete'] = false;
                    //retrieve and return form
                    try {
                        const retrievedForm = await FormSchema.findOne( filter ).exec ();
                        if(!retrievedForm) {
                            logger.info ( `handle get ${form} request`, {
                                req, res, info: `${form} was not found!!`
                            } );
                            return res.status ( 404 ).json ( {
                                error: "Failed to retrieve form", message: `Form not found`
                            } )
                        }
                        if ( retrievedForm ) {
                            logger.info ( `handle get ${form} request`, {
                                req, res, info: `${form} was found successfully!!`
                            } );
                            return res.status ( 200 ).json ( retrievedForm );
                        }

                    } catch (err) {
                        logger.error ( `handle get ${form} request`, {req, res, error: err} );
                        return res.status ( 400 ).json ( {
                            error: "Failed to retrieve form", message: `An error Occurred!: \r\n ${err}`
                        } )
                    }
                }
            }

        }
    }
};
export const getAllForm = {
    path: '/api/:appSlug/all-forms/:form',
    method: 'get', 
    handler: async (req, res) => {

        //retrieve variables
        const form = req.params.form;
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug  );
        if(!permission) {
            logger.error ( `handle get all ${form} request`, {
                req,
                res,
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`
            } );
            return res.status ( 400 ).json ( {
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`,
            } )
        }
        if ( permission ) {
            //retrieve schema
            const schema = await FormSchemaTemplates.findOne ( {slug: form, appSlug: appSlug} ).exec();
            if(!schema) {
                logger.error ( `handle get all ${form} request`, {
                    req,
                    res,
                    message: "Retrieving Form Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`
                } )
                return res.status ( 400 ).json ( {
                    message: "Retrieving Form Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`,
                } )
            }
            if ( schema ) {

                const schemaTypes = buildSchemaTypes ( schema );
                //retrieve application information
                const anApp =  new Application();
                anApp.appSlug = appSlug;
                const app = await anApp.getBySlug();
                if(!app) {
                    logger.error ( `handle get all ${form} request`, {
                        req,
                        res,
                        message: "Retrieving Form Failed",
                        error: `Not permitted`,
                        type: "schema retrieval error",
                        description: `An error Occurred finding the requested schema`
                    } )
                    return res.status ( 400 ).json ( {
                        message: "Retrieving Form Failed",
                        error: `Not permitted`,
                        type: "schema retrieval error",
                        description: `An error Occurred finding the requested schema`,
                    } )
                }
                if ( app ) {
                    //create schema
                    const FormSchema = buildSchema ( schemaTypes, app, form, DATA_TYPE.form.value);
                    //retrieve and return form
                    try {
                        const retrievedForms = await FormSchema.find ( {bcDelete: false} ).exec();
                        logger.info ( `handle get all ${form}  request`, {
                            req, res, info: `${form} found successfully!!`
                        } );
                        return res.status ( 200 ).json ( retrievedForms );
                    } catch (err) {
                        logger.error ( `handle get all ${form} request`, {
                            req, res, error: `${form} not found: ${err}`
                        } );
                        return res.status ( 400 ).json ( {
                            error: "Failed to retrieve form", message: `An error Occurred!: \r\n ${err}`
                        } )
                    }
                }
            }
        }

    }
};
export const getSomeForm = {
    path: '/api/:appSlug/some-form/:form', method: 'get', handler: async (req, res) => {

        //retrieve variables
        const form = req.params.form;
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug  );
        if(!permission) {
            logger.error ( `handle delete ${form} request`, {
                req,
                res,
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`
            } );
            return res.status ( 400 ).json ( {
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`,
            } )
        }
        if ( permission ) {
            //retrieve schema
            const schema = await FormSchemaTemplates.findOne ( {slug: form, appSlug: appSlug} ).exec ();
            if(!schema) {
                logger.error ( `handle get some ${form} request`, {
                    req,
                    res,
                    message: "Retrieving Form Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`
                } )
                return res.status ( 400 ).json ( {
                    message: "Retrieving Form Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`,
                } )
            }
            if ( schema ) {
                //retrieve schema builder
                const schemaTypes = buildSchema ( schema );
                //retrieve application information
                const anApp =  new Application();
                anApp.appSlug = appSlug;
                const app = await anApp.getBySlug();
                if(!app){
                    logger.error ( `handle get some ${form} request`, {
                        req,
                        res,
                        message: "Retrieving Form Failed",
                        error: `Not permitted`,
                        type: "application retrieval error",
                        description: `the application specified does not exist or cannot be located check system management logs`
                    } )
                    return  res.status ( 400 ).json ( {
                        message: "Retrieving Form Failed",
                        error: `Not permitted`,
                        type: "application retrieval error",
                        description: `the application specified does not exist or cannot be located check system management logs`,
                    } )
                }
                if ( app ) {

                    //create schema
                    const FormSchema = buildSchema ( schemaTypes, app, form, DATA_TYPE.form.value);

                    const {filters} = req.body;
                    filters['bcDelete'] = false;
                    try {
                        const retrievedForm = await FormSchema.find ( filters ).exec ();
                        logger.info ( `handle get some ${form}  request`, {
                            req, res, info: `${form} found successfully!!`
                        } );
                        return res.status ( 200 ).json ( retrievedForm );
                    } catch (err) {
                        logger.error ( `handle get some ${form} request`, {
                            req, res, error: `${form} not found: ${err}`
                        } );
                        return res.status ( 400 ).json ( {
                            error: "Failed to retrieve form", message: `An error Occurred!: \r\n ${err}`
                        } )
                    }
                }
            }
        }

    }
};
export const createNewForm = {
    path: '/api/:appSlug/create-form/:form', method: 'post', handler: async (req, res) => {

        //retrieve variables
        const form = req.params.form;
        const appSlug = req.params.appSlug;
        const newInputs = req.body;
        const role = req.headers[HEADER_ROLE];
        //access validation
        try{

            console.log(form, "form");

            console.log("[NUB] Create Request Role Header Value","role", role);

            // retrieve schema
            const schema =  await FormSchemaTemplates.findOne({slug: form, appSlug: appSlug}).exec();

            if(!schema){
                logger.error ( `handle create ${form} request`, {
                    req,
                    res,
                    message: "Form Creation Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`
                } )
               return res.status ( 400 ).json ( {
                    status: 400,
                    message: "Form Creation Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`,
                } )
            }

            //retrieve application information
            const anApp =  new Application();
            anApp.appSlug = appSlug;
            const app = await anApp.getBySlug();
            if(!app){
                logger.error ( `handle create ${form} request`, {
                    req,
                    res,
                    message: "Creation Failed!",
                    error: `This entry is not permitted`,
                    type: "application retrieval error",
                    description: `the application specified does not exist or cannot be located check system management logs`
                } )
                return  res.status ( 400 ).json ( {
                    status: 400,
                    message: "Creation Failed!",
                    error: `This entry is not permitted`,
                    type: "application retrieval error",
                    description: `the application specified does not exist or cannot be located check system management logs`,
                } )
            }

            const schemaTypes = buildSchemaTypes ( schema );
            //create schema
            const FormSchema = buildSchema ( schemaTypes, app, form, DATA_TYPE.form.value );

            //retrieve all existing forms
            const allForms = await FormSchema.find ().exec ();


            const formLength = allForms.length;
            const newFormBuild = {};
            const builder = await FormBuilderSchema.findOne ( {
                slug: form, appSlug: appSlug
            } ).exec ().then ();


            //validate unique fields are not being duplicated by the new input, find out if a field is unique by checking the builder,
            //then, if unique ensure the value doesn't already exist
            const checkUnique = builder.fields.some ( field => {
                if ( field.isUnique ) {
                    const checking = newInputs[camelize ( field.fieldName )];
                    const index = allForms.findIndex ( function (item ) {
                        return item[camelize ( field.fieldName )] === checking
                    } );
                    return index < 0;
                }
            } );

            if(!checkUnique){
                logger.error ( `handle create ${form} request`, {
                    req,
                    res,
                    message: "Creation Failed!",
                    error: `This entry is not permitted`,
                    type: "duplicating unique data",
                    description: `a unique field you are trying to pass already exists`
                } )
                return res.status ( 400 ).json ( {
                    status: 400,
                    message: "Creation Failed!",
                    error: `This entry is not permitted`,
                    type: "duplicating unique data",
                    description: `a unique field you are trying to pass already exists`
                } )
            }

            schema.schemaTypes.forEach ( schemaType => {
                const schemaTypeName = schemaType.name;
                const fieldValueArray = builder.fields.filter ( field => {
                    return camelize ( field.fieldName ) === schemaTypeName
                } );
                try {

                    const fieldValueObject = JSON.parse ( JSON.stringify ( fieldValueArray[0] ) )

                    const switchValue = fieldValueObject.contentType.name.toLowerCase ();

                    // build new form
                    buildNewEntry (newFormBuild, now, fieldValueArray, switchValue, schemaTypeName, fieldValueObject, formLength, req );

                } catch (e) {
                    logger.error ( 'handle autogenerated values', {error: e} );
                }
            } );

            //build system values and form information
            const systemFields = ['bcCreatedOn', 'bcLastModified'];
            const formInfo = [{
                infoName: 'bcPublish', infoValue: req.body['bcPublish'] ? req.body['bcPublish'] : false
            }, {infoName: 'bcCreatedBy', infoValue: req.body['bcCreatedBy']}, {
                infoName: 'bcDelete', infoValue: false
            }];
            if ( req.body['bcPublish'] ) {
                formInfo.push ( {infoName: 'bcPublishedOn', infoValue: now} );
            }
            formInfo.forEach ( field => {
                newFormBuild[field.infoName] = field.infoValue;
            } );
            systemFields.forEach ( field => {
                newFormBuild[field] = now;
            } );

            //create new form
            const newForm = new FormSchema ( newFormBuild );

            //save new form
            try {
                await newForm.save ();
            } catch (err) {
                logger.error ( `handle create ${form} request`, {req, res, error: err} );
                return res.status ( 400 ).json ( {status: 400, message: `An error Occurred!: \r\n ${err}`} )
            }
            logger.info ( `handle create ${form} request`, {
                req, res, info: `${form} was sent successfully!!`
            } );
            return res.status ( 200 ).json ( {status:200, message: "Success!"} )
        }catch (error) {
            logger.error(`Caught Errors in Create Request`, {
                error: error
            })

            return res.status ( 400 ).json ( {status: 400, message: `An error Occurred!: \r\n ${error}`} )
        }


    }
};
export const updateForm = {
    path: '/api/:appSlug/update-form/:form/:identifier',
    method: 'put',
    
    handler: async (req, res) => {

        //retrieve variables
        const identifier = req.params.identifier;
        const form = req.params.form;
        const appSlug = req.params.appSlug;
        const updates = req.body;

        const role = req.headers[HEADER_ROLE];

        //access validation
        const permission = permissionValidation ( role, appSlug  );
        console.log(updates, "updates")

        if(!permission){
            logger.error ( `handle delete ${form} request`, {
                req,
                res,
                message: "Operation Failed",
                error: `Not permitted`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`
            } );
            return res.status ( 401 ).json ( {
                status: 401,
                message: "Operation Failed",
                error: `Not Permitted, Access Denied`,
                type: "permission denied",
                description: `Permission validation failed please provide a valid permission and try again`,
            } )
        }

        if ( permission ) {

            // create schema
            const schema = await FormSchemaTemplates.findOne ( {slug: form, appSlug: appSlug} ).exec ();

            if(!schema){
                logger.error ( `handle update ${form} request`, {
                    req,
                    res,
                    message: "Form Update Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`
                } )
                return res.status ( 404 ).json ( {
                    status: 404,
                    message: "Form Update Failed",
                    error: `Resource not found`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`,
                } )
            }
            if ( schema ) {
                const schemaTypes = buildSchemaTypes ( schema );
                if ( updates.hasOwnProperty ( 'bcCreatedBy' ) ) {
                    return  res.status ( 400 ).json ( {
                        message: "Update Failed!",
                        error: `This entry is not permitted`,
                        type: "updating immutable value",
                        description: `cannot update bcCreatedBy`,
                    } )
                }
                else {
                    //retrieve application information
                    const anApp =  new Application();
                    anApp.appSlug = appSlug;
                    const app = await anApp.getBySlug();
                    if(!app){
                        logger.error ( `handle update ${form} request`, {
                            req,
                            res,
                            message: "Update Failed!",
                            error: `Application not Found`,
                            type: "application retrieval error",
                            description: `the application specified does not exist or cannot be located check system management logs`
                        } )
                       return  res.status ( 404 ).json ( {
                            status: 404,
                            message: "Update Failed!",
                            error: `Application not Found`,
                            type: "application retrieval error",
                            description: `the application specified does not exist or cannot be located check system management logs`,
                        } )
                    }
                    if ( app ) {
                        const FormSchema = buildSchema ( schemaTypes, app, form, DATA_TYPE.form.value );
                        const allForms = await FormSchema.find ().exec ();
                        const searchable = allForms.filter ( form => form[schema.identifier] !== identifier );
                        const builder = await FormBuilderSchema.findOne ( {
                            slug: form, appSlug: appSlug
                        } ).exec().then();
                        const checkAutogenerate = builder.fields.some ( field => {
                            return !!(updates[camelize ( field.fieldName )] && field.autoGenerate);
                        } );

                        if ( checkAutogenerate ) {
                            logger.error ( `handle update ${form} request`, {
                                req,
                                res,
                                message: "Update Failed!",
                                error: `This entry is not permitted`,
                                type: "You cannot update an autogenerated value",
                                description: `System blocks updating autogenerated fields`
                            } )
                            return res.status ( 400 ).json ( {
                                status: 400,
                                message: "Update Failed!",
                                error: `This entry is not permitted`,
                                type: "You cannot update an autogenerated value",
                                description: `System blocks updating autogenerated fields`
                            } )
                        }
                        if(!checkAutogenerate){
                            const checkUnique = builder.fields.some ( field => {
                                return !!(updates[camelize ( field.fieldName )] && field.isUnique);
                            } );
                            if(!checkUnique){
                                const filter = {};
                                filter[schema.identifier] = identifier;
                                try {
                                    await FormSchema.updateOne ( filter, updates );
                                } catch (err) {
                                    logger.error ( `handle update ${form} request`, {req, res, error: err} );
                                    return res.status ( 400 ).json ( {message: `An error Occurred!: \r\n ${err}`} )
                                }
                                logger.info ( `handle update ${form} request`, {
                                    req, res, info: `${form} was updated successfully!!`
                                } );
                                return res.status ( 200 ).json ( {message: "Success!"} )
                            }
                            if(checkUnique){
                                const validateUnique = builder.fields.some ( field => {
                                    if ( updates[camelize ( field.fieldName )] ) {
                                        const checking = updates[camelize ( field.fieldName )];
                                        const index = searchable.findIndex ( function (item) {
                                            return item[camelize ( field.fieldName )] === checking
                                        } );
                                        return index < 0;
                                    }
                                } );
                                if ( !validateUnique ) {
                                    logger.error ( `handle update ${form} request`, {
                                        req,
                                        res,
                                        message: "Update Failed!",
                                        error: `This entry is not permitted`,
                                        type: "duplicating unique data or invalid data",
                                        description: `a unique field you are trying to pass already exists or the field you are updating does not exist`
                                    } )
                                    return res.status ( 400 ).json ( {
                                        status: 400,
                                        message: "Update Failed!",
                                        error: `This entry is not permitted`,
                                        type: "duplicating unique data or invalid data",
                                        description: `a unique field you are trying to pass already exists or the field you are updating does not exist`
                                    } )
                                }
                                if(validateUnique){
                                    const filter = {};
                                    filter[schema.identifier] = identifier;
                                    try {
                                        await FormSchema.updateOne ( filter, updates );
                                    } catch (err) {
                                        logger.error ( `handle update ${form} request`, {req, res, error: err} );
                                        return res.status ( 400 ).json ( {message: `An error Occurred!: \r\n ${err}`} )
                                    }
                                    logger.info ( `handle update ${form} request`, {
                                        req, res, info: `${form} was updated successfully!!`
                                    } );
                                    return res.status ( 200 ).json ( {message: "Success!"} )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
