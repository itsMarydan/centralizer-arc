import { BASE_URL } from "./api-enum"

export const USER_API = {
    GET_ALL: `${BASE_URL.AUTH}/users`,
    GET_BY_ID(id: any){
        return `${BASE_URL.AUTH}/user/${id}`
    },
    CREATE: `${BASE_URL.AUTH}/create-user`,
    UPDATE(id: any) {
      return  `${BASE_URL.AUTH}/users/${id}`
    }
}

export const KEY_VALUE_API = {
    GET_ALL: `${BASE_URL.MANAGER}/key-value-store`,
    GET_BY_KEY(key: string){
        return `${BASE_URL.MANAGER}/get-key-value-pair/${key}`
    },
    UPDATE(key: string){
        return `${BASE_URL.MANAGER}/update-key-value-pair/${key}`
    }
}

export const AUTH_API = {
    LOGIN: `${BASE_URL.AUTH}/login`,
    VERIFY_EMAIL(verificationString: string){ 
        return `${BASE_URL.AUTH}/verify-email/${verificationString}`},
    FORGOT_PASS(email: string){
        return `${BASE_URL.AUTH}/forgot-password/${email}`
    },
    RESET_PASS(resetCode: string){
        return `${BASE_URL.AUTH}/users/reset-password/${resetCode}`
    },
    CREATE_OPTIONS: `${BASE_URL.AUTH}/create-option`,
    GET_USER_OPTIONS(userId: number){
        return `${BASE_URL.AUTH}/option/${userId}`
    },
    UPDATE_OPTIONS(userId: number, optionType: string){
        return `${BASE_URL.AUTH}/update-option/${optionType}/${userId}`
    },
    GET_ROLE_BY_ROLE(role: string){
        return `${BASE_URL.AUTH}/role-by-role/${role}`
    },
    SIGNUP: `${BASE_URL.AUTH}/create-user`,
    REST_PASS_ADMIN(email: string){
        return `${BASE_URL.AUTH}/users/reset-password-as-admin/${email}`
    }
}

 
export const APPS_API = {
    PERMITTED_APPS(role: string){
        return `${BASE_URL.NUB}/apps-by-role/${role}`
    },
    CREATE_APP: `${BASE_URL.NUB}/create-app`,
    SOFT_DELETE_APP(appSlug: string){
        return `${BASE_URL.NUB}/soft-delete-app/${appSlug}`
    },
    UPDATE(appSlug: string) {
        return`${BASE_URL.NUB}/update-app/${appSlug}`
    }
}

export const GLOBAL_API = {
    FILE_UPLOAD: `${BASE_URL.DUTY}/upload`,
    GET_FILE_BY_APP(){
        return `${BASE_URL.DUTY}/all-files-binary`
    }
}
export const CONTENTS_API = {
    CONTENTS_BY_APP(appSlug: string){
        return `${BASE_URL.NUB}/data/${appSlug}/0`
    },
    CREATE_CONTENT_BUILDER(appSlug: string){
        return `${BASE_URL.NUB}/${appSlug}/create-content-builder`
    },
    GET_CONTENT_BUILDER(appSlug: string, slug: string){
        return  `${BASE_URL.NUB}/${appSlug}/get-content-builder/${slug}`
    },
    ADD_BUILDER_FIELD(appSlug: string, slug: string){
        return `${BASE_URL.NUB}/${appSlug}/add-content-builder-field/${slug}`
    },
    DELETE_BUILDER_FIELD(appSlug: string, slug: string, fieldName: string){
        return `${BASE_URL.NUB}/${appSlug}/delete-content-builder-field/${slug}/${fieldName}`
    },
    UPDATE_BUILDER_FIELD(appSlug: string, slug: string, fieldName: string){
       return `${BASE_URL.NUB}/${appSlug}/update-content-builder-field/${slug}/${fieldName}`
    },
    BUILD_CONTENT(appSlug: string){
        return `${BASE_URL.NUB}/${appSlug}/create-content-schema`
    },
    GET_CONTENT_SCHEMA(appSlug: string, slug: string){
        return `${BASE_URL.NUB}/${appSlug}/content-schema/${slug}`
    },
    GET_CONTENT_LIST(appSlug: string, slug: string){
        return `${BASE_URL.NUB}/${appSlug}/all-contents/${slug}`
    },
    DELETE_CONTENT_ITEM(appSlug: string, slug: string, identifier: any){
        return`${BASE_URL.NUB}/${appSlug}/delete-content/${slug}/${identifier}`
    },
    UPDATE_CONTENT_ITEM(appSlug: string, slug: string, identifier: any){
        return `${BASE_URL.NUB}/${appSlug}/update-content/${slug}/${identifier}`
    },
    CREATE_CONTENT(appSlug: string, slug: string){
        return `${BASE_URL.NUB}/${appSlug}/create-content/${slug}`
    },
    GET_CONTENT(appSlug: string, slug: string, identifier: any){
        return `${BASE_URL.NUB}/${appSlug}/get-content/${slug}/${identifier}`
    },
    UPDATE_CONTENT(appSlug: string, slug: string, identifier: any){
        return `${BASE_URL.NUB}/${appSlug}/update-content/${slug}/${identifier}`
    }
}

export const FORMS_API = {
    FORMS_BY_APP(appSlug: string){
        return `${BASE_URL.NUB}/data/${appSlug}/1`
    },
    CREATE_FORM_BUILDER(appSlug: string){
        return `${BASE_URL.NUB}/${appSlug}/create-form-builder`
    },
    GET_FORM_BUILDER(appSlug: string, slug: string){
        return `${BASE_URL.NUB}/${appSlug}/get-form-builder/${slug}`
    },
    GET_FORM_SCHEMA(appSlug: string, slug: string){
        return `${BASE_URL.NUB}/${appSlug}/form-schema/${slug}`
    },
    ADD_BUILDER_FIELD(appSlug: string, slug: string){
        return `${BASE_URL.NUB}/${appSlug}/add-form-builder-field/${slug}`
    },
    DELETE_BUILDER_FIELD(appSlug: string, slug: string, fieldName: string){
        return `${BASE_URL.NUB}/${appSlug}/delete-form-builder-field/${slug}/${fieldName}`
    },
    UPDATE_BUILDER_FIELD(appSlug: string, slug: string, fieldName: string){
        return `${BASE_URL.NUB}/${appSlug}/update-form-builder-field/${slug}/${fieldName}`
    },
    CREATE_FORM(appSlug: string, slug: string){
        return `${BASE_URL.NUB}/${appSlug}/create-form/${slug}`
    },
    BUILD_FORM(appSlug: string){
        return `${BASE_URL.NUB}/${appSlug}/create-form-schema`
    },
    DELETE_FORM_ITEM(appSlug: string, slug: string, identifier: any){
        return`${BASE_URL.NUB}/${appSlug}/delete-form/${slug}/${identifier}`
    },
    GET_FORM_LIST(appSlug: string, slug: string){
        return `${BASE_URL.NUB}/${appSlug}/all-forms/${slug}`
    }
}

export const AUTHORIZE_API = {
    GET_RULES: `${BASE_URL.AUTH}/rules`,
    GET_ROLES: `${BASE_URL.AUTH}/roles`,
    GET_POLICIES: `${BASE_URL.AUTH}/policies`,
}