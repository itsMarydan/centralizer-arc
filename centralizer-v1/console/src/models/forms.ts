export interface Builder{
    formName: string,
    fields: any,
    isDynamic: boolean
}


export interface FormSingle{
    slug: string;
    formName: string;
    isDynamic: boolean;
    isPublished: boolean;
}

export interface BuilderObject{
    formName: string,
    fields: any,
    isDynamic: boolean,
    isPublished: boolean,
    isDeleted: boolean,
    appSlug: string,
    slug: string
}