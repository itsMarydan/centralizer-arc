import {RuleSchema} from "../database/mongoose/rule_schema";
import rulesJson from "../data/rules.json";
import { loadRules, addActions} from "../database/mongo/methods/rules";
import {logger} from "../logger/winson";
import {arrayToLowerCase, arrayToUpperCase, generateId} from "../helper";

export default class Rule {
    get isLocked() {
        return this._isLocked;
    }

    set isLocked(value) {
        this._isLocked = value;
    }
    get ruleId() {
        return this._ruleId;
    }

    set ruleId(value) {
        this._ruleId = value;
    }

    get ruleName() {
        return this._ruleName;
    }

    set ruleName(value) {
        this._ruleName = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get actions() {
        return this._actions;
    }

    set actions(value) {
        this._actions = value;
    }

    constructor(ruleId, ruleName, description, actions, isLocked) {
        this._ruleId = this.ruleId;
        this._ruleName = ruleName;
        this._description = this.description;
        this._actions = actions;
        this._isLocked = isLocked;
    }

    async ruleInstance() {
        const ruleId = await this.generateRuleId();
        return new RuleSchema({
            ruleId: parseInt(ruleId),
            ruleName: this.generateRuleName(),
            description: this.generateDescription(),
            actions: this.sortedActions(),
            isLocked: false,
        })
    }

    async updateRule() {
        console.log("[AUTH]::", "[INFO]", "Rule ID", this.ruleId);
       return  addActions(this.ruleId, this.actions).then(result => {
            console.log("[AUTH]::", "[RESULT]", "Update Rule", result);
            if(result.validation === "PARTIAL") {
                return {
                    message: result.message,
                    validation: result.validation,
                    status: 200,
                }
            }
            return {
                message: `Rule Updated Successfully!`,
                validation: result.validation,
                status: 200,
            }
        }).catch(error => {
            logger.error("Load Immutable Rules", error);
            return {
                message: `An error Occurred!: \r\n ${error}`,
                validation: "FAILED",
                status: 400,
            }
        });
    }

    sortedActions(){
        return arrayToUpperCase(this.actions.sort());
    }

    generateRuleName(){
        return this.sortedActions().join("/");
    }

    generateDescription() {
        return `allows ` +  arrayToLowerCase(this.sortedActions()).join(", ").replace(/,([^,]*)$/, ' and$1') +  ` access to policy scope`;
    }

    async loadRules() {
        await loadRules(rulesJson).then(result => {
            console.log("[MONGO_CLIENT]::", "[RESULT]", "Load Immutable Rules", result);

        }).catch(error => {
            console.log("[MONGO_CLIENT]::", "[ERROR]", "Load Immutable Rules", error);
        });
        return rulesJson;
    }

    async saveRule() {
        const ruleName = this.generateRuleName();
        console.log("[AUTH]::", "[INFO]", "Rule Name", ruleName);

        const checkIfRuleExists = await this.checkIfRuleExists({ruleName: ruleName});
        console.log("[AUTH]::", "[RESULT]", "Check If Rule Exists", checkIfRuleExists);
        if(checkIfRuleExists) {

            return {message: "Rule Already Exists!", status: "FAILED"};
        }
        try{
            const rule = await this.ruleInstance();
            await rule.save();
            console.log("[MONGO_CLIENT]::", "[RESULT]", "Save Rule", rule);
            return {message: "Rule Saved Successfully!", status: "OK"};
        }catch (error) {
            console.log("[MONGO_CLIENT]::", "[ERROR]", "Save Rule", error);
            return {message: "An error Occurred!", status: "ERROR"};
        }
    }

    async generateRuleId() {
        let ruleId = generateId();
        const checkIfRuleExists = await this.checkIfRuleExists({ruleId: ruleId});
        if(checkIfRuleExists) {
           return this.generateRuleId();
        }
      return (ruleId);
    }

    async checkIfRuleExists(filter) {
        const rule = await RuleSchema.findOne(filter).exec();
        return !!rule;
    }

     getRules() {
        return RuleSchema.find().exec();
    }

    getRule(ruleId) {
        return RuleSchema.findOne({ruleId: ruleId});
    }

    async deleteRule(ruleId) {
        try {
            const rule = await RuleSchema.findOne({ruleId: ruleId});
            if (rule) {
                 if(rule.isLocked === true) {
                        return {message: "Rule is Locked! and Cant be deleted", status: "FAILED"};
                 }
                 await rule.deleteOne();
                 console.log("[MONGO_CLIENT]::", "[RESULT]", "Delete Rule", rule);
            }
            return {message: "Rule Deleted Successfully!", status: "OK"};
        }catch (
            error) {
            console.log("[AUTH]::", "[ERROR]", "Delete Rule", error);
            return {message: "An error Occurred!", status: "ERROR"};
        }
    }
}