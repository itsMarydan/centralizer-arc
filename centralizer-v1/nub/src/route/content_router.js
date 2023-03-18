import {ContentBuilderSchema, ContentSchemaTemplates} from "../database/db_schemas";
import {logger} from "../logger/winson";
import {camelize} from "../helper/case-convert";
import {getUser, permissionValidation} from "../external/external_retriever";
import {buildNewEntry, buildSchema, buildSchemaTypes} from "../methods/builders";
import Application from "../classes/app_class";
import {HEADER_ROLE, USER_ID} from "../enums/role_types";
import {DATA_TYPE} from "../static/types.js";
const now = new Date ();

export const deleteContent = {
    path: '/api/:appSlug/delete-content/:content/:identifier',
    method: 'delete',
    handler: async (req, res) => {

        //retrieve variables
        const content = req.params.content; // where content is content-name
        const identifier = req.params.identifier;
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug  );

        if(!permission) {
            logger.error ( `handle delete ${content} request`, {
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
            const schema = await ContentSchemaTemplates.findOne ( {slug: content, appSlug: appSlug} ).exec ();

            if ( schema ) {

                //initiate a schema json object and load data from the schema object authhub
                const schemaTypes = buildSchemaTypes ( schema );

                //retrieve application information
                const anApp =  new Application();
                anApp.appSlug = appSlug;
                const app = await anApp.getBySlug();

                if ( app ) {

                    //create schema
                    const ContentSchema = buildSchema ( schemaTypes, app, content, DATA_TYPE.content.value);
                    //build filter and update json objects
                    const filter = {};
                    filter[schema.identifier] = identifier;
                    const updates = {'bcDelete': true, 'bcPublish': false};
                    // update item to show delete is true and contentStatus is false
                    try {


                        await ContentSchema.findOneAndUpdate( filter, updates );
                        logger.info ( `handle delete ${content} request`, {
                            req, res, info: `${content} was deleted successfully!!`
                        } );
                        return res.status ( 200 ).json ( {message: "Success!"} )
                    } catch (err) {
                        logger.error ( `handle delete ${content} request`, {req, res, error: err} );
                        return res.status ( 400 ).json ( {
                            error: "Failed to delete content", message: `An error Occurred!: \r\n ${err}`
                        } )
                    }

                }
                else {
                    logger.info ( `handle delete ${content} request`, {
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
                logger.error ( `handle delete ${content} request`, {
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
export const getContent = {
    path: '/api/:appSlug/get-content/:content/:identifier',
    method: 'get',
    handler: async (req, res) => {
        const content = req.params.content;
        const identifier = req.params.identifier;
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug  );
        console.log(content, "content");
        if ( permission ) {

            //retrieve schema
            const schema = await ContentSchemaTemplates.findOne ( {slug: content, appSlug: appSlug} ).exec ();

            if ( schema ) {
                const schemaTypes = buildSchemaTypes ( schema );
                //retrieve application information
                const anApp =  new Application();
                anApp.appSlug = appSlug;
                const app = await anApp.getBySlug();
                if ( app ) {
                    //create schema
                    const ContentSchema = buildSchema ( schemaTypes, app, content, DATA_TYPE.content.value);
                    //build filter
                    const filter = {};
                    filter[schema.identifier] = identifier;
                    filter ['bcDelete'] = false;
                    //retrieve and return content
                    try {
                        const retrievedContent = await ContentSchema.findOne( filter ).exec ();
                        if ( retrievedContent ) {
                            logger.info ( `handle get ${content} request`, {
                                req, res, info: `${content} was found successfully!!`
                            } );
                            return res.status ( 200 ).json ( retrievedContent );
                        }
                        else {
                            logger.info ( `handle get ${content} request`, {
                                req, res, info: `${content} was not found!!`
                            } );
                            return res.status ( 404 ).json ( {
                                error: "Failed to retrieve content", message: `Content not found`
                            } )
                        }

                    } catch (err) {
                        logger.error ( `handle get ${content} request`, {req, res, error: err} );
                        return res.status ( 400 ).json ( {
                            error: "Failed to retrieve content", message: `An error Occurred!: \r\n ${err}`
                        } )
                    }
                }
                else {
                    logger.error ( `handle get ${content} request`, {
                        req,
                        res,
                        message: "Retrieving Content Failed",
                        error: `Not permitted`,
                        type: "application retrieval error",
                        description: `the application specified does not exist or cannot be located check system management logs`
                    } )
                    res.status ( 400 ).json ( {
                        message: "Retrieving Content Failed",
                        error: `Not permitted`,
                        type: "application retrieval error",
                        description: `the application specified does not exist or cannot be located check system management logs`,
                    } )
                }
            }
            else {
                logger.error ( `handle get ${content} request`, {
                    req,
                    res,
                    message: "Retrieving Content Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`
                } )
                res.status ( 400 ).json ( {
                    message: "Retrieving Content Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`,
                } )
            }
        }
        else {
            logger.error ( `handle delete ${content} request`, {
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
export const getAllContent = {
    path: '/api/:appSlug/all-contents/:content',
    method: 'get', 
    handler: async (req, res) => {

        //retrieve variables
        const content = req.params.content;
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug  );

        if ( permission ) {
            //retrieve schema
            const schema = await ContentSchemaTemplates.findOne ( {slug: content, appSlug: appSlug} ).exec();

            if ( schema ) {

                const schemaTypes = buildSchemaTypes ( schema );
                //retrieve application information
                const anApp =  new Application();
                anApp.appSlug = appSlug;
                const app = await anApp.getBySlug();
                if ( app ) {
                    //create schema

                    const ContentSchema = buildSchema ( schemaTypes, app, content, DATA_TYPE.content.value);
                    //retrieve and return contents
                    try {
                        const retrievedContents = await ContentSchema.find ( {bcDelete: false} ).exec();
                        logger.info ( `handle get all ${content}  request`, {
                            req, res, info: `${content} found successfully!!`
                        } );
                        return res.status ( 200 ).json ( retrievedContents );
                    } catch (err) {
                        logger.error ( `handle get all ${content} request`, {
                            req, res, error: `${content} not found: ${err}`
                        } );
                        return res.status ( 400 ).json ( {
                            error: "Failed to retrieve content", message: `An error Occurred!: \r\n ${err}`
                        } )
                    }
                }
                else {
                    logger.error ( `handle get all ${content} request`, {
                        req,
                        res,
                        message: "Retrieving Content Failed",
                        error: `Not permitted`,
                        type: "schema retrieval error",
                        description: `An error Occurred finding the requested schema`
                    } )
                    res.status ( 400 ).json ( {
                        message: "Retrieving Content Failed",
                        error: `Not permitted`,
                        type: "schema retrieval error",
                        description: `An error Occurred finding the requested schema`,
                    } )
                }
            }
            else {
                logger.error ( `handle get all ${content} request`, {
                    req,
                    res,
                    message: "Retrieving Content Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`
                } )
                res.status ( 400 ).json ( {
                    message: "Retrieving Content Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`,
                } )
            }
        }
        else {
            logger.error ( `handle get all ${content} request`, {
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
export const getSomeContent = {
    path: '/api/:appSlug/some-content/:content', method: 'get', handler: async (req, res) => {

        //retrieve variables
        const content = req.params.content;
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug  );

        if ( permission ) {

            //retrieve schema
            const schema = await ContentSchemaTemplates.findOne ( {slug: content, appSlug: appSlug} ).exec ();
            if ( schema ) {
                //retrieve schema builder
                const schemaTypes = buildSchema ( schema );
                //retrieve application information
                const anApp =  new Application();
                anApp.appSlug = appSlug;
                const app = await anApp.getBySlug();
                if ( app ) {

                    //create schema
                    const ContentSchema = buildSchema ( schemaTypes, app, content, DATA_TYPE.content.value);

                    const {filters} = req.body;
                    filters['bcDelete'] = false;
                    try {
                        const retrievedContent = await ContentSchema.find ( filters ).exec ();
                        logger.info ( `handle get some ${content}  request`, {
                            req, res, info: `${content} found successfully!!`
                        } );
                        return res.status ( 200 ).json ( retrievedContent );
                    } catch (err) {
                        logger.error ( `handle get some ${content} request`, {
                            req, res, error: `${content} not found: ${err}`
                        } );
                        return res.status ( 400 ).json ( {
                            error: "Failed to retrieve content", message: `An error Occurred!: \r\n ${err}`
                        } )
                    }
                }
                else {
                    logger.error ( `handle get some ${content} request`, {
                        req,
                        res,
                        message: "Retrieving Content Failed",
                        error: `Not permitted`,
                        type: "application retrieval error",
                        description: `the application specified does not exist or cannot be located check system management logs`
                    } )
                    res.status ( 400 ).json ( {
                        message: "Retrieving Content Failed",
                        error: `Not permitted`,
                        type: "application retrieval error",
                        description: `the application specified does not exist or cannot be located check system management logs`,
                    } )
                }
            }
            else {
                logger.error ( `handle get some ${content} request`, {
                    req,
                    res,
                    message: "Retrieving Content Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`
                } )
                res.status ( 400 ).json ( {
                    message: "Retrieving Content Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`,
                } )
            }
        }
        else {
            logger.error ( `handle delete ${content} request`, {
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
export const createNewContent = {
    path: '/api/:appSlug/create-content/:content', method: 'post', handler: async (req, res) => {

        //retrieve variables
        const content = req.params.content;
        const appSlug = req.params.appSlug;
        const createdBy = req.headers[USER_ID];
        const newInputs = req.body;
        const role = req.headers[HEADER_ROLE];
        //access validation
        try{

            console.log(content, "content");

            console.log("[NUB] Create Request Role Header Value","role", role);
            const permission = await permissionValidation ( role, appSlug  );

            if (!permission ){
                logger.error ( `handle delete ${content} request`, {
                    req,
                    res,
                    message: "Operation Failed",
                    error: `Not permitted`,
                    type: "permission denied",
                    description: `Permission validation failed please provide a valid permission and try again`
                } );
                return res.status ( 401 ).json ( {
                    message: "Operation Failed",
                    status: 401,
                    error: `Not permitted`,
                    type: "permission denied",
                    description: `Permission validation failed please provide a valid permission and try again`,
                } )
            }

            if(permission.error){
                logger.error ( `handle delete ${content} request`, {
                    req,
                    res,
                    message: "Operation Failed",
                    error: `Not permitted`,
                    type: "permission denied",
                    description: `Permission validation failed please provide a valid permission and try again`
                } );
               return  res.status ( 401 ).json ( {
                    message: "Operation Failed",
                    status: 401,
                    error: `Not permitted`,
                    type: "permission denied",
                    description: `Permission validation failed please provide a valid permission and try again`,
                } )
            }
            // retrieve schema
            const schema =  await ContentSchemaTemplates.findOne({slug: content, appSlug: appSlug}).exec();

            if(!schema){
                logger.error ( `handle create ${content} request`, {
                    req,
                    res,
                    message: "Content Creation Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`
                } )
               return res.status ( 400 ).json ( {
                    status: 400,
                    message: "Content Creation Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`,
                } )
            }
            const user = await getUser ( (parseInt ( createdBy )) );
            if(!user){
                logger.error ( `handle create ${content} request`, {
                    req,
                    res,
                    message: "Creation Failed!",
                    error: `This entry is not permitted`,
                    type: "must provide a valid bcCreatedBy value",
                    description: `createdBy value not valid`,
                    errorData: {
                        error: `This entry is not permitted`,
                        type: "user retrieval error",
                        description: `the user specified does not exist or cannot be located check auth hub logs`,
                    }
                } )
                return res.status ( 400 ).json ( {
                    status: 400,
                    message: "Creation Failed!",
                    error: `This entry is not permitted`,
                    type: "must provide a valid bcCreatedBy value",
                    description: `createdBy value not valid`,
                    errorData: {
                        error: `This entry is not permitted`,
                        type: "user retrieval error",
                        description: `the user specified does not exist or cannot be located check auth hub logs`,
                    }
                } )
            }

            //retrieve application information
            const anApp =  new Application();
            anApp.appSlug = appSlug;
            const app = await anApp.getBySlug();
            if(!app){
                logger.error ( `handle create ${content} request`, {
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
            const ContentSchema = buildSchema ( schemaTypes, app, content, DATA_TYPE.content.value );

            //retrieve all existing contents
            const allContent = await ContentSchema.find ().exec ();

            const contentLength = allContent.length;
            const newContentBuild = {};
            const builder = await ContentBuilderSchema.findOne ( {
                slug: content, appSlug: appSlug
            } ).exec ().then ();


            //validate unique fields are not being duplicated by the new input, find out if a field is unique by checking the builder,
            //then, if unique ensure the value doesn't already exist
            const checkUnique = builder.fields.some ( field => {
                if ( field.isUnique ) {
                    const checking = newInputs[camelize ( field.fieldName )];
                    const index = allContent.findIndex ( function (item ) {
                        return item[camelize ( field.fieldName )] === checking
                    } );
                    return index < 0;
                }
            } );

            if(!checkUnique){
                logger.error ( `handle create ${content} request`, {
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

                    // build new content
                    buildNewEntry (newContentBuild, now, fieldValueArray, switchValue, schemaTypeName, fieldValueObject, contentLength, req );

                } catch (e) {
                    logger.error ( 'handle autogenerated values', {error: e} );
                }
            } );

            //build system values and content information
            const systemFields = ['bcCreatedOn', 'bcLastModified'];
            const contentInfo = [{
                infoName: 'bcPublish', infoValue: req.body['bcPublish'] ? req.body['bcPublish'] : false
            }, {infoName: 'bcCreatedBy', infoValue: req.body['bcCreatedBy']}, {
                infoName: 'bcDelete', infoValue: false
            }];
            if ( req.body['bcPublish'] ) {
                contentInfo.push ( {infoName: 'bcPublishedOn', infoValue: now} );
            }
            contentInfo.forEach ( field => {
                newContentBuild[field.infoName] = field.infoValue;
            } );
            systemFields.forEach ( field => {
                newContentBuild[field] = now;
            } );

            //create new content
            const newContent = new ContentSchema ( newContentBuild );

            //save new content
            try {
                await newContent.save ();
            } catch (err) {
                logger.error ( `handle create ${content} request`, {req, res, error: err} );
                return res.status ( 400 ).json ( {status: 400, message: `An error Occurred!: \r\n ${err}`} )
            }
            logger.info ( `handle create ${content} request`, {
                req, res, info: `${content} was sent successfully!!`
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
export const updateContent = {
    path: '/api/:appSlug/update-content/:content/:identifier', 
    method: 'put',
    
    handler: async (req, res) => {

        //retrieve variables
        const identifier = req.params.identifier;
        const content = req.params.content;
        const appSlug = req.params.appSlug;
        const updates = req.body;

        const role = req.headers[HEADER_ROLE];

        //access validation
        const permission = permissionValidation ( role, appSlug  );
        console.log(updates, "updates")

        if(!permission){
            logger.error ( `handle delete ${content} request`, {
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
            const schema = await ContentSchemaTemplates.findOne ( {slug: content, appSlug: appSlug} ).exec ();

            if(!schema){
                logger.error ( `handle update ${content} request`, {
                    req,
                    res,
                    message: "Content Update Failed",
                    error: `Not permitted`,
                    type: "schema retrieval error",
                    description: `An error Occurred finding the requested schema`
                } )
                return res.status ( 404 ).json ( {
                    status: 404,
                    message: "Content Update Failed",
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
                        logger.error ( `handle update ${content} request`, {
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
                        const ContentSchema = buildSchema ( schemaTypes, app, content, DATA_TYPE.content.value );
                        const allContent = await ContentSchema.find ().exec ();
                        const searchable = allContent.filter ( content => content[schema.identifier] !== identifier );
                        const builder = await ContentBuilderSchema.findOne ( {
                            slug: content, appSlug: appSlug
                        } ).exec().then();
                        const checkAutogenerate = builder.fields.some ( field => {
                            return !!(updates[camelize ( field.fieldName )] && field.autoGenerate);
                        } );

                        if ( checkAutogenerate ) {
                            logger.error ( `handle update ${content} request`, {
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
                                    await ContentSchema.updateOne ( filter, updates );
                                } catch (err) {
                                    logger.error ( `handle update ${content} request`, {req, res, error: err} );
                                    return res.status ( 400 ).json ( {message: `An error Occurred!: \r\n ${err}`} )
                                }
                                logger.info ( `handle update ${content} request`, {
                                    req, res, info: `${content} was updated successfully!!`
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
                                    logger.error ( `handle update ${content} request`, {
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
                                        await ContentSchema.updateOne ( filter, updates );
                                    } catch (err) {
                                        logger.error ( `handle update ${content} request`, {req, res, error: err} );
                                        return res.status ( 400 ).json ( {message: `An error Occurred!: \r\n ${err}`} )
                                    }
                                    logger.info ( `handle update ${content} request`, {
                                        req, res, info: `${content} was updated successfully!!`
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
