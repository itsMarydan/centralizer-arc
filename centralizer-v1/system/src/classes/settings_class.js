import {SettingsSchema} from "../database/settings_schema";
import {v4 as uuid} from "uuid";

export default class Settings{
    get settingsType() {
        return this._settingsType;
    }

    set settingsType(value) {
        this._settingsType = value;
    }

    get settingsId() {
        return this._settingsId;
    }

    set settingsId(value) {
        this._settingsId = value;
    }

     _settingsId;
    constructor(settingsType, settingsConfig){
        this._settingsId = uuid();
        this._settingsType = settingsType;
        this._settingsConfig = settingsConfig;
    }

    settingsInstance(){
        return new SettingsSchema({
            settingsId: this.settingsId,
            settingsType: this._settingsType,
            settingsConfig: this._settingsConfig
        })
    }
    async createSettings() {
        try {
            await this.settingsInstance().save();
            return true
        } catch (e) {
            console.error(e);
            return false
        }
    }

    async updateSettings(updates) {
        try{
            await SettingsSchema.updateOne ( {settingsId: this.settingsId}, updates );
            return true
        }catch (err) {
            console.error(err)
            return false
        }
    }

    async retrieveSettings() {
        try {
            return   await SettingsSchema.findOne ( {settingsId: this.settingsId} );
        } catch (err) {
            console.error ( err )
            return false
        }
    }

    async retrieveSettingsByType() {
        try {
            return   await SettingsSchema.findOne ( {settingsType: this.settingsType} );

        } catch (err) {
            console.error ( err )
            return false
        }
    }
    async retrieveAll(){
        try{
            return  await SettingsSchema.find().exec();
        }catch (e) {
            console.error(e);
            return false
        }
    }
    async deleteSettings() {
        try {
            await SettingsSchema.deleteOne ( {settingsId: this.settingsId} );
            return true
        } catch (err) {
            console.error ( err )
            return false
        }
    }

}