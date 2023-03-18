import Rule from "../classes/rule_class";
import {logger} from "../logger/winson";

export const loadRules = {
    path: '/api/rules',
    method: 'post',
    handler: async (req, res) => {
        const aRule = new Rule();
        try {
            const rules = await aRule.loadRules();
            return res.status(200).json(rules);
        } catch (err) {
            logger.error(`handle load rules request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
    }

}
export const updateRule = {
    path: '/api/rule/:ruleId',
    method: 'put',
    handler: async (req, res) => {
        const actions = req.body.actions;
        const ruleId = parseInt(req.params.ruleId);
        try {
            console.log("[AUTH]::", "[ID]", ruleId, "Update Rule", actions);
            const rule = new Rule();
            rule.ruleId = ruleId;
            rule.actions = actions;
            rule.updateRule().then(result => {
                console.log("[AUTH]::", "[RESULT]", "Update Rule", result);
                if(result.validation === "PARTIAL") {
                    return res.status(200).json({
                        message: result.message,
                        validation: result.validation,
                        status: 200,
                    });
                }
                return res.status(200).json({
                    message: `Rule Updated Successfully!`,
                    validation: result.validation,
                    status: 200,
                });
            }).catch(error => {
                logger.error("Load Immutable Rules", error);
                return res.status(400).json({
                    message: `An error Occurred!: \r\n ${error}`,
                    validation: "FAILED",
                    status: 400,
                })
            });
        } catch (err) {
            logger.error(`handle load rules request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
    }
}

export const getRules = {
    path: '/api/rules',
    method: 'get',
    handler: async (req, res) => {
        const aRule = new Rule();
        try {
            const rules = await aRule.getRules();
            return res.status(200).json(rules);
        } catch (err) {
            logger.error(`handle get rules request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
    }
}

export const getRule = {
    path: '/api/rule/:ruleId',
    method: 'get',
    handler: async (req, res) => {
        const aRule = new Rule();
        const ruleId = parseInt(req.params.ruleId);
        try {
            const rule = await aRule.getRule(ruleId);
            return res.status(200).json(rule);
        } catch (err) {
            logger.error(`handle get rule request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
    }
}

export const deleteRule = {
    path: '/api/rule/:ruleId',
    method: 'delete',
    handler: async (req, res) => {
        const aRule = new Rule();
        const ruleId = parseInt(req.params.ruleId);
        try {
            const rule = await aRule.deleteRule(ruleId);
            return res.status(200).json(rule);
        } catch (err) {
            logger.error(`handle delete rule request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
    }
}

export const createRule = {
    path: '/api/rule',
    method: 'post',
    handler: async (req, res) => {
        const aRule = new Rule();
        aRule.actions = req.body.actions;

        console.log("[AUTH]::", "Create Rule", aRule.actions);
        if (!Array.isArray(aRule.actions)) {
            return res.status(400).json({message: `Invalid Actions!`, status: 400});
        }
        try {
            const rule = await aRule.saveRule();
            return res.status(200).json(rule);
        } catch (err) {
            logger.error(`handle create rule request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
    }

}