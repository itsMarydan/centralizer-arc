import mongoose, {Schema} from "mongoose";
import { debug } from "winston";
import {underscore} from "../helper/case-convert";

export function buildSchemaTypes (schema){
    const schemaTypes = {};
    schema.schemaTypes.forEach(function (schemaType) {
        const schemaTypeName = schemaType.name;
        schemaType.type === 'Schema.Types.Mixed' ?
            schemaTypes[schemaTypeName] = Schema.Types.Mixed :
        schemaTypes[schemaTypeName] = schemaType.type;
    });
    schemaTypes['bcCreatedOn'] = 'Date';
    schemaTypes['bcLastModified'] = 'Date';
    schemaTypes['bcPublish'] = 'Boolean';
    schemaTypes['bcPublishedOn'] = 'Date';
    schemaTypes['bcCreatedBy'] = 'String';
    schemaTypes['bcDelete'] = 'Boolean';

    return schemaTypes;
}

export function buildSchema(schemaTypes, app, content, dataType){
    // mongoose-client.set('debug' , true)
    const contentSchema = new mongoose.Schema(schemaTypes);
    const db = mongoose.connection.useDb(`${app.appDatabase}`);
    const modelName = `${dataType}_${underscore(content)}`;
    return db.models[modelName] || db.model(modelName, contentSchema);
}

export function buildNewEntry(newContentBuild, now, fieldValueArray, switchValue, schemaTypeName, fieldValueObject, contentLength, req){

    switch (switchValue) {
        case 'number':
            if (fieldValueObject.autoGenerate) {
                const initialValue = fieldValueObject.initialValue;
                if (contentLength === 0) {
                    newContentBuild[schemaTypeName] = initialValue;
                } else {
                    const valueAdded =  fieldValueObject.increaseBy * (contentLength)
                    const calculatedValue = parseInt(initialValue) + (valueAdded);
                    newContentBuild[schemaTypeName] = calculatedValue;
                }
            } else {
                newContentBuild[schemaTypeName] = req.body[schemaTypeName];
            }
            break;
        case 'date':
            if (fieldValueObject.autoGenerate) {
                newContentBuild[schemaTypeName] = now;
            } else {
                newContentBuild[schemaTypeName] = req.body[schemaTypeName];
            }
            break;
        case 'date time':
            if (fieldValueObject.autoGenerate) {
                newContentBuild[schemaTypeName] = now;
            } else {
                newContentBuild[schemaTypeName] = req.body[schemaTypeName];
            }
            break;
        case 'time':
            if (fieldValueObject.autoGenerate) {
                newContentBuild[schemaTypeName] = now.getDate() + ":" + now.getMinutes();
            } else {
                newContentBuild[schemaTypeName] = req.body[schemaTypeName];
            }
            break;
        default:
            newContentBuild[schemaTypeName] = req.body[schemaTypeName];
            break;
    }
}

