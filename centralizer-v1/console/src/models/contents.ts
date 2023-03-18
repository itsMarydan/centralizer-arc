
export interface ContentSingle{
    slug: string;
    contentName: string;
    isDynamic: boolean;
    isPublished: boolean;
}

export interface Builder{
    contentName: string,
    fields: any,
    isDynamic: boolean
}


export interface BuilderObject{
    contentName: string,
    fields: any,
    isDynamic: boolean,
    isPublished: boolean,
    isDeleted: boolean,
    appSlug: string,
    slug: string
}

export interface  BuilderAuth{
    appSlug: string,
    slug: string,
    userRole: string
}

export interface SchemaObject {
    slug: string;
    schemaName: string;
    identifier: string;
    appSlug: string;
}

export interface NewContentInput{
    name: string,
    value: any
}