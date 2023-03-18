import mongoConnect from "../client";
import {arrayToLowerCase, compareAndRemoveDuplicatesInArray1} from "../../../helper";

export async function loadRules(rulesJson) {
    mongoConnect(async (client) => {
        let database = await client.db(process.env.DB_NAME);
        let collection = await database.collection(process.env.RULES_COLLECTION);
       await collection.insertMany(rulesJson).then((result) => {
            console.log("[MONGO_CLIENT]::","[INFO]",`The provided rules have been registered successfully!`, result);
        }).then(()=>{
            console.log("[MONGO_CLIENT]::","[INFO]",`The provided rules have been registered successfully!`);
            client.close();
            console.log("[MONGO_CLIENT]::","[INFO]",`Client Closed!`);

        }).catch((error) => {
            console.log("[MONGO_CLIENT]::","[ERROR]", "Load Rules Job",error);
        });
    }).then(result => {
        console.log("[MONGO_CLIENT]::","[RESULT]", "Load Rules Job",result);
    }).catch(error => {
        console.log("[MONGO_CLIENT]::","[ERROR]", "Load Rules Job",error);
    }).finally(() => {
        console.log("[MONGO_CLIENT]::","[INFO]", "Load Rules Job","Job Completed");
    });
}

export async function addActions(ruleId, actions) {
    let initialActions = actions;
    let message = "The provided rule actions have been registered successfully!";
    let validation = "SUCCESS";
    return mongoConnect(async (client) => {
        let database = client.db(process.env.DB_NAME);
        let collection = database.collection(process.env.RULES_COLLECTION);

        console.log("[MONGO_CLIENT]::","[INFO]", "collection", collection);

        const rule = await collection.findOne({ruleId: ruleId});
        console.log("[MONGO_CLIENT]::", "[INFO]", `Rule`, rule);

        actions = compareAndRemoveDuplicatesInArray1(actions, rule.actions);

        if(actions.length !== initialActions.length) {
            console.log("[MONGO_CLIENT]::", "[INFO]", `The provided rule actions have been updated successfully but some actions already exist!`);
            message = "The provided rule actions have been updated successfully but some actions already exist!";
            validation = "PARTIAL";
        }
        actions = [...rule.actions, ...actions];
        const sorted = actions.sort();
        console.log("[MONGO_CLIENT]::","[DEBUG]",`New Actions`, actions , sorted);
        console.log("[MONGO_CLIENT]::","[DEBUG]",`Rule Name `, sorted.join("/"));


        const descriptionList = arrayToLowerCase(sorted);
        rule.ruleName = sorted.join("/");
        rule.actions = sorted;
        console.log("[MONGO_CLIENT]::","[DEBUG]",`description`, descriptionList.join(", ").replace(/,([^,]*)$/, ' and$1'))
        rule.description = `allows ` +  descriptionList.join(", ").replace(/,([^,]*)$/, ' and$1') +  ` access to policy scope`;
        console.log("[MONGO_CLIENT]::","[DEBUG]",`Rule`, rule);

        await collection.updateOne({
            ruleId: ruleId
        }, {
            $set: {
                ruleName: rule.ruleName,
                description: rule.description,
                actions: rule.actions
            }
        }).then((result) => {
            console.log("[MONGO_CLIENT]::","[INFO]",`The provided rule actions have been registered successfully!`, result);
            client.close(); 
            console.log("[MONGO_CLIENT]::","[INFO]",`Client Closed!`);
        }).catch((error) => {
            console.log("[MONGO_CLIENT]::","[ERROR]", "Add Actions Job",error);
        })
        return {result: rule, message: message, validation: validation};
    }).then(result => {
        console.log("[MONGO_CLIENT]::","[RESULT]", "Get Rules Job",result);
        return {result: result, message: message, status: "OK", validation: validation};

    }).catch(error => {
        console.log("[MONGO_CLIENT]::","[ERROR]", "Get Rules Job",error);
        return {result: error, message: "Error while updating rule actions", status: "ERROR", validation: "FAILED"};
    });
}