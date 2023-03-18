export interface Application{
    appName: string;
    appId: string;
    appSlug: string;
    appStatus: string;
    appSecrets: [];
    appDatabase: string;
    appManager: number;
    createdBy: string;
    createdOn: Date;
    isDeleted: boolean;
    lastModified: Date; 
}