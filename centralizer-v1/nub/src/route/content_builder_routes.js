import {logger} from "../logger/winson";
import {ContentBuilderSchema} from "../database/db_schemas";
import {kebab} from "../helper/case-convert";
import {permissionValidation} from "../external/external_retriever";
import {HEADER_ROLE} from "../enums/role_types";
import Data from "../classes/data_class";
import { removeByFieldName } from "../helper/array";
export const createContentBuilder = {
    path: '/api/:appSlug/create-content-builder',
    method: 'post',
    handler: async (req, res) => {
        //retrieve request variables
        const {contentName, fields, isDynamic} = req.body;
        const appSlug = req.params.appSlug;

        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation (role, appSlug );

        if ( permission ) {
            //create slug in kebab-case.
            const slug = kebab ( contentName.toLowerCase() );
            //build a new content builder with the ContentBuilder Schema
            const contentBuilder = new ContentBuilderSchema ( {
                slug: slug,
                contentName: contentName,
                fields: fields,
                isDynamic: isDynamic,
                appSlug: appSlug
            } );
            const dataObject = new Data();
            //save new content builder
            try {
                const validation = await dataObject.validateBuilderExistence(0,contentName);
                if(validation){
                    console.log(validation)
                    return res.status ( 200 ).json ( { status: 409 ,message: `A builder for ${contentName} already exists`} )
                }else{
                    await contentBuilder.save();
                    logger.info ( 'handle request builder create', {req, res, info: `Builder Data Was Save!`} )
                    return res.status ( 200 ).json ( { status: 200 ,message: "Success!"} )
                }
            } catch (err) {
                logger.error ( 'handle request builder create', {req, res, error: err} )
                return res.status ( 500 ).json ( {
                    error: "Unable to save new builder",
                    message: `An error Occurred!: ${err}`
                } )
            }
        }
        else {
            logger.error ( 'handle request builder create', {
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
export const getContentBuildersByApplication = {
    path: '/api/:appSlug/content-builders',
    method: 'get',
    handler: async (req, res) => {
        //retrieve request variables
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];

        //access validation
        const permission = permissionValidation ( role, appSlug );

        if ( permission ) {
            //retrieve and return builder
            try {
                const content = await ContentBuilderSchema.find ( {appSlug: appSlug} ).exec ();
                logger.info ( 'handle request get all builders', {req, res, info: `Contents Found successfully!!`} )
                return res.status ( 200 ).json ( content );
            } catch (err) {
                logger.error ( 'handle request get all builders', {req, res, error: err} )
                return res.status ( 500 ).json ( {
                    error: "Failed to retrieve builder",
                    message: `An error Occurred!: \r\n ${err}`
                } )
            }
        }
        else {
            logger.error ( 'handle request get all builders', {
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
export const getAllContentBuilders = {
    path: '/api/content-builders',
    method: 'get',
    handler: async (req, res) => {

        //retrieve and return all builders
        try {
            const content = await ContentBuilderSchema.find ().exec ();
            logger.info ( 'handle request get all builders', {req, res, info: `Contents Found successfully!!`} )
            return res.status ( 200 ).json ( content );
        } catch (err) {
            logger.error ( 'handle request get all builders', {req, res, error: err} )
            return res.status ( 500 ).json ( {
                error: "Failed to retrieve builders",
                message: `An error Occurred!: \r\n ${err}`
            } )
        }
    }
};
export const getContentBuilder = {
    path: '/api/:appSlug/get-content-builder/:slug',
    method: 'get',
    handler: async (req, res) => {

        //retrieve request variables
        const slug = req.params.slug;
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug );

        if ( permission ) {
            //retrieve and return builder
            try {
                const content = await ContentBuilderSchema.findOne ( {slug: slug, appSlug: appSlug} ).exec ();
                logger.info ( 'handle request get builder', {req, res, info: `Content Found successfully!!`} )
                return res.status ( 200 ).json ( content );
            } catch (err) {
                logger.error ( 'handle request get builder', {req, res, error: err} )
                return res.status ( 500 ).json ( {message: `An error Occurred!: \r\n ${err}`} )
            }
        }
        else {
            logger.error ( 'handle request get builder', {
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
export const addContentBuilderFields = {
    path: '/api/:appSlug/add-content-builder-field/:slug',
    method: 'put',
    handler: async (req, res) => {

        // retrieve request variables
        const slug = req.params.slug;
        const appSlug = req.params.appSlug;
        const newFiled  = req.body;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug );

        if ( permission ) {
            //find builder, add new field, save builder
            try {
                const content = await ContentBuilderSchema.findOne ( {slug: slug, appSlug: appSlug} ).exec ();
                const checkDuplicate = content.fields.some(field => field.fieldName.toLowerCase() === newFiled.fieldName.toLowerCase());

                console.log(checkDuplicate, "checkDuplicate")
                if(checkDuplicate){
                    logger.error ( 'handle request add field to builder failed due to duplication' );
                    return res.status ( 200 ).json ( {
                        status: 400,
                        error: "Failed to add field to builder",
                        message: `Duplicated Data`,
                        description: `Data is a duplicate entry, Field Name must be unique`
                    } )
                }
                content.fields.push ( newFiled );
                await content.save ();
            } catch (err) {
                logger.error ( 'handle request add field to builder', {req, res, error: err} );
                return res.status ( 500 ).json ( {
                    status: 500,
                    error: "Failed to add field to builder",
                    message: `An error Occurred!: \r\n ${err}`
                } )
            }
            logger.info ( 'handle request add field to builder', {
                req,
                res,
                info: `Content Fields for ${slug} was updated successfully!!!`
            } )
            return res.status ( 200 ).json ( {status: 200, message: "Success!"} )
        }
        else {
            logger.error ( 'handle request add field to builder', {
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
export const updateContentBuilderField = {
    path: '/api/:appSlug/update-content-builder-field/:slug/:fieldName',
    method: 'put',
    handler: async (req, res) => {

        // retrieve variables
        const slug = req.params.slug;
        const fieldName = req.params.fieldName;
        const appSlug = req.params.appSlug;
        const update = req.body;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug );

        if ( permission ) {
            //find and update content builder
            try {
                const content = await ContentBuilderSchema.findOne ( {slug: slug, appSlug: appSlug} ).exec ();
                removeByFieldName(content.fields, fieldName);
                const checkDuplicate = content.fields.some(field => field.fieldName.toLowerCase() === update.fieldName.toLowerCase());
                console.log(checkDuplicate)
                if(checkDuplicate){
                    logger.error ( 'handle request update field in builder failed due to duplication' );
                    return res.status ( 200 ).json ( {
                        status: 400,
                        error: "Failed to update field in builder",
                        message: `Duplicated Data`,
                        description: `Data is a duplicate entry, Field Name must be unique`
                    } )
                }
                await ContentBuilderSchema.findOneAndUpdate ( {slug: slug, appSlug: appSlug},
                    {"$set": {"fields.$[elem]": update}},
                    {"arrayFilters": [{ "elem.fieldName": fieldName}]} );

                    return res.status ( 200 ).json ( {status: 200, message: "Success!"} )
            } catch (err) {
                logger.error ( 'handle request update builder field', {req, res, error: err} )
                return res.status ( 500 ).json ( {message: `An error Occurred!: \r\n ${err}`} )
            }
            logger.info ( 'handle request update builder field', {
                req,
                res,
                info: `Content Fields for ${slug} was updated successfully!!`
            } )
         
        }
        else {
            logger.error ( 'handle request update builder field', {
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
export const deleteContentBuilderField = {
    path: '/api/:appSlug/delete-content-builder-field/:slug/:fieldName',
    method: 'delete',
    handler: async (req, res) => {

        // retrieve variables
        const slug = req.params.slug;
        const fieldName = req.params.fieldName;
        const appSlug = req.params.appSlug;
        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation ( role, appSlug );

        if ( permission ) {
            //delete fields
            try {
                await ContentBuilderSchema.updateOne ( {
                    slug: slug,
                    appSlug: appSlug
                }, {$pull: {fields: {fieldName: fieldName}}} ).exec ();
                logger.info ( 'handle request delete field in builder', {req, res, info: 'Success!'} )
                return res.status ( 200 ).json ( {status: 200, message: "Success!"} )
            } catch (err) {
                logger.error ( 'handle request delete filed in builder', {req, res, error: err} )
                return res.status ( 500 ).json ( {status: 500, message: `An error Occurred!: \r\n ${err}`} )
            }

        }
        else {
            logger.error ( 'handle request delete filed in builder', {
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

