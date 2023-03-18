import mongoConnect from "../client";
import Role from "../../../classes/role_class";
import Rule from "../../../classes/rule_class";
import {ALL_APPS} from "../../../enums/static";

export async function appLevelPermissionExists(appSlug){
    const output = []
    return mongoConnect(async (client) => {
        let database = client.db(process.env.DB_NAME);
        let collection = database.collection(process.env.POLICIES_COLLECTION);

         await collection.findOne({apps: appSlug}).then((result) => {
            console.log("[MONGO_CLIENT]::", "[INFO]", `The provided app slug has been found successfully!`, result);
            output.push(result);
            return result;
        }).then(() => {
            client.close();
            console.log("[MONGO_CLIENT]::", "[INFO]", `Client Closed!`);
        }).catch((error) => {
            console.log("[MONGO_CLIENT]::", "[ERROR]", "App Level Permission Exists Job", error);
            return null;
        });

        return output;
        // return await collection.findOne({apps: appSlug});
    }).then(result => {
    console.log("[MONGO_CLIENT]::","[RESULT]", "App Level Permission Exists Job",result , output);
        return output;
    }).catch(error => {
        console.log("[MONGO_CLIENT]::","[ERROR]", "App Level Permission Exists",error);
    });
}


export async function policyIdsFromRole(roleId){
    const output = []
     return await mongoConnect(async (client) => {
         let database = client.db(process.env.DB_NAME);
         let collection = database.collection(process.env.ROLES_COLLECTION);
         console.log("[MONGO_CLIENT]::", "[INFO]", `Role Id in policybyid from role funcion: ${roleId}`);
         const role = await collection.findOne({roleId: parseInt(roleId)}).then((result) => {
                console.log("[MONGO_CLIENT]::", "[INFO]", `The provided role has been found successfully!`, result);
                client.close();
                console.log("[MONGO_CLIENT]::", "[INFO]", `Client Closed!`);
                return result;
         }).catch((error) => {
                console.log("[MONGO_CLIENT]::", "[ERROR]", "Policy Ids From Role Job", error);
         });
        console.log("[MONGO_CLIENT]::", "[INFO]", `Role`, role);
         if (role) {
             console.log("[MONGO_CLIENT]::", "[INFO]", `The provided role has been found successfully!`, role);
             role.policies.forEach(policy => {
                 output.push(policy);
             });
         }

         return output;

     }).then(result => {
            console.log("[MONGO_CLIENT]::","[RESULT]", "Policy Ids From Role Job",output);
            return output;
     }).catch(error => {
         console.log("[MONGO_CLIENT]::", "[ERROR]", "Policy Ids From Role Job", error);
     })

}

export async function policiesByIds(policyIds) {
    let output;
    return mongoConnect(async (client) => {
        let database = client.db(process.env.DB_NAME);
        let collection = database.collection(process.env.POLICIES_COLLECTION);
        await collection.find({policyId: {$in: policyIds}}).toArray().then((result) => {
            console.log("[MONGO_CLIENT]::", "[INFO]", `The provided policy ids have been found successfully!`, result);
            output = result;
            return result;
        }).then(()=> {
            client.close();
            console.log("[MONGO_CLIENT]::", "[INFO]", `Client Closed!`);
        }).catch((error) => {
            console.log("[MONGO_CLIENT]::", "[ERROR]", "Permitted Apps By Policies Job", error);
            return null;
        });
        return output;
    }).then(result => {
    console.log("[MONGO_CLIENT]::","[RESULT]", "Permitted Apps By Policies Job",output);
    return output;
    }).catch(error => {
        console.log("[MONGO_CLIENT]::","[ERROR]", "Permitted Apps By Policies",error);
    });
}

export async function permittedAppSlugsFromPolicies(policies){
    const apps = [];
    policies.forEach((policy) => {

        policy.apps.forEach((app) => {
            if(!apps.includes(app)){
                apps.push(app);
            }
        });
    });
    return apps;
}

export function policyWithAppPermission(policies, appSlug){
    console.log("Terrorising here", policies, appSlug);
    return policies.filter((element) =>
        element.apps.includes(appSlug) || element.apps.includes(ALL_APPS));
}



export function mergedRulesByPolicy(policies){
    const mergedRules = [];
    policies.forEach((policy) => {
        policy.rules.forEach((rule) => {
            if(!mergedRules.includes(rule)){
                mergedRules.push(rule);
            }
        });
    });
    return mergedRules;
}

export async function getRulesByRuleNames(ruleNames) {
    const rules = [];
    const aRule = new Rule();
    const allRules = await aRule.getRules();
    console.log("All Rules", allRules);
    ruleNames.forEach((ruleName) => {
        const rulesFound = allRules.filter((element) => element.ruleName === ruleName);
        rulesFound.forEach((rule) => rules.push(rule));
    });
    console.log("Rules", rules);
    return rules;
}

export function mergedActionsByRules(rules){
    const actions = [];
    console.log("Rules", rules);
    rules.forEach((rule) => {
        rule.actions.forEach((action) => {
            if(!actions.includes(action)){
                actions.push(action);
            }
        });
    });
    return actions;
}

export async function permittedActionsByPolicies(policies) {
    const ruleNamesFromPolicies = mergedRulesByPolicy(policies);
    const rulesByRuleNames = await getRulesByRuleNames(ruleNamesFromPolicies);
    return mergedActionsByRules(rulesByRuleNames);
}

export async function isPermittedTOAccessApp(appSlug, roleId) {

    const policyIds = await policyIdsFromRole(roleId);
    console.log("[MONGO_CLIENT]::", "[INFO]", `Policy Ids`, policyIds);
    const policies = await policiesByIds(policyIds);
    console.log("[MONGO_CLIENT]::", "[INFO]", `Policies`, policies);
    const policiesWithAppPermission = policyWithAppPermission(policies, appSlug);
    console.log("[MONGO_CLIENT]::", "[INFO]", `Policies With App Permission`, policiesWithAppPermission);

    return policiesWithAppPermission.length > 0;

}


export async function isActionPermittedInAppByRole(roleId, action, appSlug){

    const policyIds = await policyIdsFromRole(roleId);
    console.log("[MONGO_CLIENT]::", "[INFO]", `Policy Ids`, policyIds);
    const policies = await policiesByIds(policyIds);
    console.log("[MONGO_CLIENT]::", "[INFO]", `Policies`, policies);

    //What policies apply to the provided app slug
    const policiesWithAppPermission = policyWithAppPermission(policies, appSlug);
    console.log("[MONGO_CLIENT]::", "[INFO]", `Policies With App Permission`, policiesWithAppPermission);
    const permittedActions = await permittedActionsByPolicies(policiesWithAppPermission);
    console.log("[MONGO_CLIENT]::", "[INFO]", `Permitted Actions`, permittedActions);

    //Check if the provided action are permitted
    return permittedActions.includes(action);
}
