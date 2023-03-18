import mongoose from "mongoose";
import {mongooseDb} from "./mongoose-client";
const config = require('../config')['environment'];

const contentSchemaTemplates = new mongoose.Schema({
    slug: {
        type: String
    },
    schemaName: {
        type: String,
    },
    schemaTypes: {
        type: [],
    },
    identifier: {
        type: String
    },
    appSlug: {
        type: String
    }
});
const formSchemaTemplates = new mongoose.Schema({
    slug: {
        type: String
    },
    schemaName: {
        type: String,
    },
    schemaTypes: {
        type: [],
    },
    identifier: {
        type: String
    },
    appSlug: {
        type: String
    }
});
const contentBuilderSchema = new mongoose.Schema({
    slug: {
        type: String

    },
    contentName: {
        type: String
    },
    isDynamic: {
        type: Boolean,
        default: false
    },
    fields: {
        type: [{}],
    },
    appSlug:{
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished:{
        type: Boolean,
        default: false
    }
});
const formBuilderSchema = new mongoose.Schema({
    slug: {
        type: String

    },
    formName: {
        type: String
    },
    isDynamic: {
        type: Boolean,
        default: false
    },
    fields: {
        type: [{}],
    },
    appSlug:{
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished:{
        type: Boolean,
        default: false
    }
});


// mongoose.connect(`${config.db.url}/${config.db.database}`).then();
// mongoose.Promise = global.Promise;
// mongoose.connect(config.db.url, {
//     useNewUrlParser: true,
//     user: config.db.user,
//     pass: config.db.pwd
// }).then(() => {
//     console.log('successfully connected to the database');
// }).catch(err => {
//     console.log('error connecting to the database', err);
//     process.exit();
// })
// const db = mongoose.connection.useDb(config.db.database);
// db.on('error', console.error.bind(console, '[NUB] MongoDB Connection Error'));
// db.once('open', () => {
//     console.log('[NUB] MongoDB Connected');
// });
export const ContentSchemaTemplates = mongooseDb.model('bc_contents_schemas', contentSchemaTemplates);
export const ContentBuilderSchema = mongooseDb.model('bc_contents_builders', contentBuilderSchema);
export const FormBuilderSchema = mongooseDb.model('bc_forms_builders', formBuilderSchema);
export const FormSchemaTemplates = mongooseDb.model('bc_forms_schemas', formSchemaTemplates);
