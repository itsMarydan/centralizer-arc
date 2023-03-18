import {PolicySchema} from "../database/mongoose/policy_schema";
import policyJson from "../data/policy.json";
import {loadPolicies} from "../database/mongo/methods/policies";

export default class Policy{
    get accessLevel() {
        return this._accessLevel;
    }

    set accessLevel(value) {
        this._accessLevel = value;
    }

    get apps() {
        return this._apps;
    }

    set apps(value) {
        this._apps = value;
    }
    get policyId() {
        return this._policyId;
    }

    set policyId(value) {
        this._policyId = value;
    }

    get policyName() {
        return this._policyName;
    }

    set policyName(value) {
        this._policyName = value;
    }

    get policyDisplay() {
        return this._policyDisplay;
    }

    set policyDisplay(value) {
        this._policyDisplay = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get rules() {
        return this._rules;
    }

    set rules(value) {
        this._rules = value;
    }

    constructor(policyId, policyName, policyDisplay, description, rules, accessLevel, apps) {
        this._policyId = policyId;
        this._policyName = policyName;
        this._policyDisplay = policyDisplay;
        this._description = description;
        this._rules = rules;
        this._accessLevel = accessLevel;
        this._apps = apps;
    }

    policyInstance(){
        return new PolicySchema({
            policyId: this.policyId,
            policyName: this.policyName,
            policyDisplay: this.policyDisplay,
            description: this.description,
            rules: this.rules,
            accessLevel: this.accessLevel,
            apps: this.apps
        })
    }
    async create() {
        try {
            return await this.policyInstance().save();
        } catch (e) {
            console.log("[AUTH HUB] create policy", e)
            return false
        }
    }
    async checkForDuplicate() {
        const policy = await PolicySchema.findOne({$or: [{policyId: this.policyId}, {policyName: this.policyName}, {policyDisplay: this.policyDisplay}]}).exec();
        return !!policy;
    }
    async getPolicy(filter) {
        try {
            return await PolicySchema.findOne(filter).exec();

        } catch (e) {
            console.error("[AUTH HUB] ERROR", e)
            return false
        }
    }

    async loadPolices() {
        await loadPolicies(policyJson).then(result => {
            console.log("[MONGO_CLIENT]::", "[RESULT]", "Load Immutable Polices", result);

        }).catch(error => {
            console.log("[MONGO_CLIENT]::", "[ERROR]", "Load Immutable Polices", error);
        });
        return policyJson;
    }

    async getAll() {
        try {
            return await PolicySchema.find().exec();
        } catch (e) {
            console.log("[AUTH HUB] getAll policy", e)
        }
    }
}