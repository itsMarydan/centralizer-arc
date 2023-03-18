import {
    addContentBuilderFields,
    createContentBuilder, deleteContentBuilderField,
    getAllContentBuilders,
    getContentBuilder, getContentBuildersByApplication, updateContentBuilderField
} from "./route/content_builder_routes";
import {
    createContentSchemaTemplate,
    getAllContentSchemas,
    getContentSchema,
    getContentSchemasByApplication
} from "./route/content_schema_routes";
import {
    createNewContent,
    deleteContent,
    getAllContent,
    getContent,
    getSomeContent,
    updateContent
} from "./route/content_router";
import {
    createApplication,
    deleteApplication,
    getAllApplication,
    getApplication, getApplicationsByRole, softDeleteApplication,
    updateApplication
} from "./route/app_route";
import {testGetRoleRoute, testGetUserRoute, testPermissionRoute} from "./route/test_route";
import {getDataListByApp} from "./route/data_route";
import {cleanCollection, cleanCollectionData, cleanContent, cleanDatabase} from "./route/clean_job_routes";
import {
    createFormSchemaTemplate,
    getAllFormSchemas,
    getFormSchema,
    getFormSchemasByApplication
} from "./route/form_schema_routes";
import {
    addFormBuilderFields,
    createFormBuilder, deleteFormBuilderField,
    getAllFormBuilders,
    getFormBuilder,
    getFormBuildersByApplication, updateFormBuilderField
} from "./route/form_builder_routes";
import {createNewForm, deleteForm, getAllForm, getForm, getSomeForm, updateForm} from "./route/form_router";

export const routes = [
    createContentBuilder,
    getAllContentBuilders,
    getContentBuilder,
    addContentBuilderFields,
    updateContentBuilderField,
    deleteContentBuilderField,
    createContentSchemaTemplate,
    getContentSchema,
    getAllContentSchemas,
    getContentSchemasByApplication,
    getContentBuildersByApplication,
    deleteContent,
    getContent,
    getAllContent,
    getSomeContent,
    createNewContent,
    updateContent,
    createApplication,
    deleteApplication,
    getAllApplication,
    getApplication, softDeleteApplication,
    updateApplication,
    testGetUserRoute,
    testPermissionRoute,
    testGetRoleRoute,
    getApplicationsByRole,
    getDataListByApp,
    cleanCollectionData,
    cleanCollection,
    cleanDatabase,
    cleanContent,
    createFormSchemaTemplate,
    getFormSchema,
    getFormSchemasByApplication,
    getAllFormSchemas,
    createFormBuilder,
    getFormBuildersByApplication,
    getAllFormBuilders,
    getFormBuilder,
    addFormBuilderFields,
    updateFormBuilderField,
    deleteFormBuilderField,
    deleteForm,
    getForm,
    getAllForm,
    getSomeForm,
    createNewForm,
    updateForm
];