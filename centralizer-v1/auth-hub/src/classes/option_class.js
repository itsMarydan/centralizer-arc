import {OptionsSchema} from "../database/mongoose/options_schema";

export default class Option{
    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get optionType() {
        return this._optionType;
    }

    set optionType(value) {
        this._optionType = value;
    }

    get optionConfig() {
        return this._optionConfig;
    }

    set optionConfig(value) {
        this._optionConfig = value;
    }
    constructor(userId, optionType, optionConfig) {
        this._userId = userId;
        this._optionType = optionType;
        this._optionConfig = optionConfig;
    }

    instance(){
        return new OptionsSchema({
            userId: this.userId,
            optionType: this.optionType,
            optionConfig: this.optionConfig
        })

    }

    async checkIfExists() {
        const findOption = await OptionsSchema.findOne({userId: this.userId, optionType: this.optionType}).exec();
        return !!findOption;
    }
    async create(){
        try {
            if(await this.checkIfExists()){
                return false
            }else{
                return await this.instance().save();
            }
        } catch (e) {
            console.error("[AUTH HUB] create option error", e)
            return false
        }
    }

    async update(filter, updates) {
        try {
           return  await OptionsSchema.findOneAndUpdate(filter, updates);
        } catch (e) {

            console.error("[AUTH HUB] update option error", e)
            return false;
        }
    }

    async retrieve(filter) {
        try {
           return  await OptionsSchema.findOne(filter);
        }catch (e) {
            console.error("[AUTH HUB] retrieve option error", e)
            return false
        }
    }

    async retrieveMany(filter) {
        try {
           return  await OptionsSchema.find(filter);
        }catch (e) {
            console.error("[AUTH HUB] retrieve option error", e)
            return false
        }
    }
}