import {FORMS_API} from "../static/api-url";
import {Builder, BuilderObject, FormSingle} from "../models/forms";
import {PostResponse} from "../models/api-request";
import axiosClient from "./axiosClient";
import {SchemaObject} from "../models/contents";


export const formsApi = {
    getAllByApp(appSlug: string): Promise<FormSingle[]> {
        const url = FORMS_API.FORMS_BY_APP(appSlug);
        return axiosClient.get(url);
    },
    createBuilder(appSlug: string, payload: Builder): Promise<PostResponse> {
        const url = FORMS_API.CREATE_FORM_BUILDER(appSlug);
        return axiosClient.post(url, payload);
    },
    getBuilderBySlug(appSlug: string, slug: string, userRole: string):  Promise<BuilderObject>{
        const url = FORMS_API.GET_FORM_BUILDER(appSlug, slug);
        return axiosClient.get(url, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    addBuilderField(appSlug: string, slug: string, userRole: string, newFiled: any): Promise<PostResponse>{
        const url = FORMS_API.ADD_BUILDER_FIELD(appSlug,slug);
        return axiosClient.put(url,newFiled, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    deleteBuilderField(appSlug: string, slug: string, userRole: string, fieldName: string): Promise<PostResponse>{
        const url = FORMS_API.DELETE_BUILDER_FIELD(appSlug,slug,fieldName);
        return axiosClient.delete(url, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    updateBuilderField(appSlug: string, slug: string, userRole: string, fieldName: string, updates: any): Promise<PostResponse>{
        const url = FORMS_API.UPDATE_BUILDER_FIELD(appSlug,slug,fieldName);

        return  axiosClient.put(url,updates,{
            headers: {
                'bc-role': userRole
            }
        } )
    },
    createForm(appSlug: string, slug: string, userRole: string, newValues: any): Promise<PostResponse>{
        const url = FORMS_API.CREATE_FORM(appSlug, slug);
        return axiosClient.post(url,newValues,{
            headers: {
                'bc-role': userRole
            }
        })
    },
    getAllFormsBySlug(appSlug: string, slug: string, userRole: string): Promise<any>{
        const url = FORMS_API.GET_FORM_LIST(appSlug, slug);
        return axiosClient.get(url, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    buildForm(appSlug: string, userRole: string, schema: any): Promise<PostResponse>{
        const url = FORMS_API.BUILD_FORM(appSlug);
        return axiosClient.post(url, schema, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    getSchemaBySlug(appSlug: string, slug: string, userRole: string): Promise<SchemaObject>{
        const url = FORMS_API.GET_FORM_SCHEMA(appSlug, slug);
        return axiosClient.get(url, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    deleteFormItem(appSlug: string, slug: string, userRole: string, identifier: any): Promise<PostResponse>{
        const url = FORMS_API.DELETE_FORM_ITEM(appSlug, slug, identifier);
        return axiosClient.delete(url, {
            headers: {
                'bc-role': userRole
            }
        })
    },
}