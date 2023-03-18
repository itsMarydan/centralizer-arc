import {HEADER_ROLE} from "../enums/role_types";
import {permissionValidation} from "../external/external_retriever";
import {kebab} from "../helper/case-convert";
import {FormBuilderSchema} from "../database/db_schemas";
import Data from "../classes/data_class";
import {logger} from "../logger/winson";
import {removeByFieldName} from "../helper/array";

export const createFormBuilder = {
    path: '/api/:appSlug/create-form-builder',
    method: 'post',
    handler: async (req, res) => {
        //retrieve request variables
        const {formName, fields, isDynamic} = req.body;
        const appSlug = req.params.appSlug;

        const role = req.headers[HEADER_ROLE];
        //access validation
        const permission = permissionValidation (role, appSlug );

        if ( permission ) {
            //create slug in kebab-case.
            const slug = kebab ( formName.toLowerCase() );
            //build a new form builder with the FormBuilder Schema
            const formBuilder = new FormBuilderSchema ( {
                slug: slug,
                formName: formName,
                fields: fields,
                isDynamic: isDynamic,
                appSlug: appSlug
            } );
            const dataObject = new Data();
            //save new form builder
            try {
                const validation = await dataObject.validateBuilderExistence(1,formName);
                if(validation){
                    console.log(validation)
                    return res.status ( 200 ).json ( { status: 409 ,message: `A builder for ${formName} already exists`} )
                }else{
                    await formBuilder.save();
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
export const getFormBuildersByApplication = {
    path: '/api/:appSlug/form-builders',
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
                const builders = await FormBuilderSchema.find ( {appSlug: appSlug} ).exec ();
                logger.info ( 'handle request get all builders', {req, res, info: `Builders Found successfully!!`} )
                return res.status ( 200 ).json ( builders );
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
export const getAllFormBuilders = {
    path: '/api/form-builders',
    method: 'get',
    handler: async (req, res) => {

        //retrieve and return all builders
        try {
            const builders = await FormBuilderSchema.find ().exec ();
            logger.info ( 'handle request get all builders', {req, res, info: `Builders Found successfully!!`} )
            return res.status ( 200 ).json ( builders );
        } catch (err) {
            logger.error ( 'handle request get all builders', {req, res, error: err} )
            return res.status ( 500 ).json ( {
                error: "Failed to retrieve builders",
                message: `An error Occurred!: \r\n ${err}`
            } )
        }
    }
};
export const getFormBuilder = {
    path: '/api/:appSlug/get-form-builder/:slug',
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
                const builder = await FormBuilderSchema.findOne ( {slug: slug, appSlug: appSlug} ).exec ();
                logger.info ( 'handle request get builder', {req, res, info: `Builder Found successfully!!`} )
                return res.status ( 200 ).json ( builder );
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
export const addFormBuilderFields = {
    path: '/api/:appSlug/add-form-builder-field/:slug',
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
                const builder = await FormBuilderSchema.findOne ( {slug: slug, appSlug: appSlug} ).exec ();
                const checkDuplicate = builder.fields.some(field => field.fieldName.toLowerCase() === newFiled.fieldName.toLowerCase());

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
                builder.fields.push ( newFiled );
                await builder.save ();
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
                info: `Form Fields for ${slug} was updated successfully!!!`
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
export const updateFormBuilderField = {
    path: '/api/:appSlug/update-form-builder-field/:slug/:fieldName',
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
            //find and update form builder
            try {
                const builder = await FormBuilderSchema.findOne ( {slug: slug, appSlug: appSlug} ).exec ();
                removeByFieldName(builder.fields, fieldName);
                const checkDuplicate = builder.fields.some(field => field.fieldName.toLowerCase() === update.fieldName.toLowerCase());
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
                await FormBuilderSchema.findOneAndUpdate ( {slug: slug, appSlug: appSlug},
                    {"$set": {"fields.$[elem]": update}},
                    {"arrayFilters": [{ "elem.fieldName": fieldName}]} );

                logger.info ( 'handle request update builder field', {
                    req,
                    res,
                    info: `Form Fields for ${slug} was updated successfully!!`
                } )
                return res.status ( 200 ).json ( {status: 200, message: "Success!"} )
            } catch (err) {
                logger.error ( 'handle request update builder field', {req, res, error: err} )
                return res.status ( 500 ).json ( {message: `An error Occurred!: \r\n ${err}`} )
            }

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
export const deleteFormBuilderField = {
    path: '/api/:appSlug/delete-form-builder-field/:slug/:fieldName',
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
                await FormBuilderSchema.updateOne ( {
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
