import {Builder, BuilderObject, SchemaObject, ContentSingle} from "../models/contents";
import {CONTENTS_API} from "../static/api-url";
import axiosClient from "./axiosClient";
import {PostResponse} from "../models/api-request";



const contentsApi = {
    getAllByApp(appSlug: string): Promise<ContentSingle[]> {
        const url = CONTENTS_API.CONTENTS_BY_APP(appSlug);
        return axiosClient.get(url);
    },
    createBuilder(appSlug: string, payload: Builder): Promise<PostResponse>{
        const url = CONTENTS_API.CREATE_CONTENT_BUILDER(appSlug);
        return  axiosClient.post(url,payload)
    },
    getBuilderBySlug(appSlug: string, slug: string, userRole: string):  Promise<BuilderObject>{
        const url = CONTENTS_API.GET_CONTENT_BUILDER(appSlug, slug);
        return axiosClient.get(url, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    addBuilderField(appSlug: string, slug: string, userRole: string, newFiled: any): Promise<PostResponse>{
        const url = CONTENTS_API.ADD_BUILDER_FIELD(appSlug,slug);
        return axiosClient.put(url,newFiled, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    deleteBuilderField(appSlug: string, slug: string, userRole: string, fieldName: string): Promise<PostResponse>{
        const url = CONTENTS_API.DELETE_BUILDER_FIELD(appSlug,slug,fieldName);
        return axiosClient.delete(url, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    updateBuilderField(appSlug: string, slug: string, userRole: string, fieldName: string, updates: any): Promise<PostResponse>{
        const url = CONTENTS_API.UPDATE_BUILDER_FIELD(appSlug,slug,fieldName);

        return  axiosClient.put(url,updates,{
            headers: {
                'bc-role': userRole
            }
        } )
    },
    buildContent(appSlug: string, userRole: string, schema: any): Promise<PostResponse>{
        const url = CONTENTS_API.BUILD_CONTENT(appSlug);
        return axiosClient.post(url, schema, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    getSchemaBySlug(appSlug: string, slug: string, userRole: string): Promise<SchemaObject>{
        const url = CONTENTS_API.GET_CONTENT_SCHEMA(appSlug, slug);
        return axiosClient.get(url, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    getAllContentBySlug(appSlug: string, slug: string, userRole: string): Promise<any>{
        const url = CONTENTS_API.GET_CONTENT_LIST(appSlug, slug);
        return axiosClient.get(url, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    deleteContentItem(appSlug: string, slug: string, userRole: string, identifier: any): Promise<PostResponse>{
        const url = CONTENTS_API.DELETE_CONTENT_ITEM(appSlug, slug, identifier);
        return axiosClient.delete(url, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    updateContentItem(appSlug: string, slug: string, userRole: string, identifier: any, updates: any): Promise<PostResponse>{
        const url = CONTENTS_API.UPDATE_CONTENT_ITEM(appSlug, slug, identifier);
        return axiosClient.put(url,updates, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    createContent(appSlug: string, slug: string, userRole: string, userId: number, newValues: any){
        const url = CONTENTS_API.CREATE_CONTENT(appSlug, slug);
        return axiosClient.post(url,newValues, {
            headers: {
                'bc-role': userRole,
                'bc-user-id': userId
            }
        })
    },
    getContentItem(appSlug: string, slug: string, userRole: string, identifier: any): Promise<any>{
        const url = CONTENTS_API.GET_CONTENT(appSlug, slug, identifier);
        return axiosClient.get(url, {
            headers: {
                'bc-role': userRole
            }
        })
    },
    updateContent(appSlug: string, slug: string, userRole: string, identifier: any, updates: any): Promise<PostResponse>{
        const url = CONTENTS_API.UPDATE_CONTENT(appSlug, slug, identifier);
        return axiosClient.put(url,updates, {
            headers: {
                'bc-role': userRole
            }
        })
    }

}

export default contentsApi;