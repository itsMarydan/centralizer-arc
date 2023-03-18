import {AppSchema} from "../database/app_schema";
import {getPermittedAppsRpc, getRoleRpc} from "../rabbitmq/rpc_client";
import {generateApplicationSlug, getFristLenghtcharacters} from "../helper/generators";
import {APP_STATUS} from "../helper/values"

export default class Application{
    get appManager() {
        return this._appManager;
    }

    set appManager(value) {
        this._appManager = value;
    }
    get isDeleted() {
        return this._isDeleted;
    }

    constructor(appName,appStatus,appSecrets, createdBy) {

        this._appName = appName;
        this._appSlug = generateApplicationSlug(this.appName).toLowerCase();
        this._appId = getFristLenghtcharacters(this.appName, 3).toLowerCase();
        this._appStatus = appStatus;
        this._appSecrets = appSecrets;
        this._createdOn = new Date();
        this._createdBy = createdBy;
        this._appManager = createdBy;
        this._lastModified = new Date();
        this._isDeleted = false;
        this._appDatabase =  `bc-${this._appSlug}`
    }

    get appName() {
        return this._appName;
    }

    set appName(value) {
        this._appName = value;
    }

    get appSlug() {
        return this._appSlug;
    }

    set appSlug(value) {
        this._appSlug = value;
    }

    get appId() {
        return this._appId;
    }

    set appId(value) {
        this._appId = value;
    }

    get appStatus() {
        return this._appStatus;
    }

    get appSecrets() {
        return this._appSecrets;
    }

    get createdOn() {
        return this._createdOn;
    }

    get createdBy() {
        return this._createdBy;
    }

    get lastModified() {
        return this._lastModified;
    }

    set lastModified(value) {
        this._lastModified = value;
    }

    get appDatabase() {
        return this._appDatabase;
    }

    applicationInstance(){
        return new AppSchema({
            appName: this.appName,
            appId: this.appId,
            appSlug: this.appSlug,
            appStatus: this.appStatus,
            appSecrets: this.appSecrets,
            appDatabase: this.appDatabase,
            appManager: this.appManager,
            createdBy: this.createdBy,
            createdOn: this.createdOn,
            isDeleted: this.isDeleted,
            lastModified: this.lastModified,
        })
    }

    async checkIfExists() {
        const findApp = await AppSchema.findOne({$or: [{appName: this.appName}, {appSlug: this.appSlug}]}).exec();
        return !!findApp;
    }

    async create() {
        const validate = await this.checkIfExists();
        console.log("I am here", validate)
        if (validate) {
            return {status: false, message: "application already exists"}
        } else {
            console.log("I ran")
            try{
                await this.applicationInstance().save();
                console.log({status: true, message: "application created"})
                return {status: true, message: "application created"}
            }catch (e){
                return {status: false, message: e.message}
            }
        }
    }

    async hardDelete() {
        try {
            await AppSchema.deleteOne({appSlug: this.appSlug});
            return {status: true, message: "application deleted"}
        }catch (e){
            return {status: false, message: e.message}
        }
    }

    async softDelete(){
        try{
            const app =  await AppSchema.findOneAndUpdate({appSlug: this.appSlug}, {isDeleted: true})
            console.log("app", app)
            return {status: true, message: "application soft deleted"}
        }catch (e){
            return {status: false, message: e.message}
        }
    }

    async getBySlug(){
        try{
            return  await AppSchema.findOne({appSlug: this.appSlug}).exec();
        }catch (e) {
            return false
        }
    }

    async getAll(){
        try{
            return await AppSchema.find().exec();
        }catch (e){
            return  false
        }
    }


    async getAllByRole(role){
        try {
            const applicationsArray = [];
            const retrievedRole = await getRoleRpc(role);
            const aRole = await JSON.parse(retrievedRole);
            console.log("role copy", await aRole)
            const retrievedApplications = await getPermittedAppsRpc(role);
            const applications = await JSON.parse(retrievedApplications);

            if ( applications.length > 0 ) {
                console.log("[NUB] ROLE", role)
                console.log("[NUB] APPLICATIONS", applications)
                const hasPermissionAll = applications.includes("all") //returns true if has permission all
                if ( hasPermissionAll ) {
                    console.log("[NUB] HAS PERMISSION ALL", hasPermissionAll)
                    const apps = await AppSchema.find({isDeleted: false}).exec();
                    console.log("[NUB] APPs", apps)
                    apps.forEach ( app => {
                        applicationsArray.push ( {appName: app.appName, appSlug: app.appSlug, appStatus: app.appStatus, appManager: app.appManager, appSecrets: app.appSecrets} )
                    } )
                } else {

                    async function getApplication(item) {
                        return await AppSchema.findOne({appSlug: item, appStatus: APP_STATUS.ACTIVE.value, isDeleted: false}).exec();
                    }
                    applications.forEach ( appSlug => {
                        if(appSlug !== "all" || appSlug !== "none"){
                            const app = getApplication(appSlug)
                            if(app.appStatus !== APP_STATUS.INACTIVE) {
                                applicationsArray.push({
                                    appName: app.appName,
                                    appSlug: app.appSlug,
                                    appStatus: app.appStatus,
                                    appManager: app.appManager,
                                    appSecrets: app.appSecrets
                                })
                            }
                        }

                    })
                    console.log("[NUB] hasPermissionAll", hasPermissionAll)

                }

            }
            return applicationsArray;
        }catch (e){
            return false
        }
    }
    async update(updates){
        if(updates.hasOwnProperty('appSlug') || updates.hasOwnProperty('appId' )
            || updates.hasOwnProperty( 'appName' ) ){
            return  {status: false, message: "failed due to update attempt on immutable fields"}
        }else{
            try {
                await AppSchema.updateOne({appSlug: this.appSlug}, updates);
                return {status: true, message: "application  updated"}
            }catch (e) {
                return {status: false, message:  e.message}
            }

        }
    }
}