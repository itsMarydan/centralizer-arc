import {ContentBuilderSchema, FormBuilderSchema} from "../database/db_schemas";

export default class Data {
    get appSlug() {
        return this._appSlug;
    }

    set appSlug(value) {
        this._appSlug = value;
    }

    get dataType() {
        return this._dataType;
    }

    set dataType(value) {
        this._dataType = value;
    }

    constructor(appSlug, dataType) {

        this._appSlug = appSlug;
        this._dataType = dataType;
    }

    async retrieveContentsByApp() {
        return await ContentBuilderSchema.find({
            appSlug: this.appSlug,
            $or: [{isDeleted: false}, {isDeleted: undefined}]
        }).exec();
    }

    async validateNewContentBuildRequest(contentName){
        const findBuilder = await ContentBuilderSchema.findOne({contentName: contentName}).exec();
        return Boolean(findBuilder);
    }

    async validateNewFormBuildRequest(formName){
        return false
    }

    async retrieveFormsByApp() {
        return await FormBuilderSchema.find({
            appSlug: this.appSlug,
            $or: [{isDeleted: false}, {isDeleted: undefined}]
        }).exec();
    }

    retrieveData(dataType) {
        switch (dataType) {
            case 0:
                return this.retrieveContentsByApp()
                break;
            case 1:
                return this.retrieveFormsByApp()
                break;
            default:
                return [];

        }
    }

    validateBuilderExistence(dataType, identifier){
        switch (dataType) {
            case 0:
                return this.validateNewContentBuildRequest(identifier)
                break;
            case 1:
                return this.validateNewFormBuildRequest(identifier)
                break;
            default:
                return [];
        }
    }
}