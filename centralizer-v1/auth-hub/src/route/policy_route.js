import {logger} from "../logger/winson";
import Policy from "../classes/policy_class";
import Role from "../classes/role_class";

export const createPolicy = {
    path: '/api/create-policy',
    method: 'post',
    handler: async (req, res) => {
        const { policyId, policyName, policyDisplay, description } = req.body;
        const aPolicy = new Policy( policyId, policyName, policyDisplay, description )

        const isDuplicate = await aPolicy.checkForDuplicate();
        if(isDuplicate){
            return res.status(500).json({
                    error: "Duplicate Policy",
                    message: "policyId, policyName and policyDisplay must have unique values"
                }
            )
        }else {

            try {
                await aPolicy.create();
                logger.info('handle method save new policy', {info: `new policy was created successfully!!`})
            }catch (e) {
                logger.error('handle request create new policy', {req, res, error: e});
                return res.status(500).json({
                    error: "Policy not saved ",
                    message: "Error caught on saving policy"
                })
            }
        }

        return res.status(200).json({message: "Success!"})
    }
}

export const loadPolices = {
    path: '/api/polices',
    method: 'post',
    handler: async (req, res) => {
        const aPolicy = new Policy();
        try {
            const polices = await aPolicy.loadPolices();
            return res.status(200).json(polices);
        } catch (err) {
            logger.error(`handle load policy request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
    }

}
export const getPolicy = {
    path: '/api/policy/:policyId',
    method: 'get',
    handler: async (req, res) => {
        const policyId = req.params.policyId;
        const aPolicy = new Policy();
        try{
            const policy = await aPolicy.getPolicy({policyId: policyId})
            if(policy){
                logger.info(`handle get policy request`, {req, res, info: `policy was found successfully!!`});
                return res.status(200).json(policy);
            }else {
                return res.status(404).json({
                        error: "Not found",
                        message: "Policy does not exist or has been marked deleted"
                    }
                )
            }
        }catch (e) {
            return res.status(404).json({
                    error: "An error occurs",
                    message: "Failed to find policy"
                }
            )
        }
    }
}
export const getAllPolicy = {
    path: '/api/policies',
    method: 'get',
    handler: async (req, res) => {
        try{
            const aPolicy = new Policy();
            const policies =  await  aPolicy.getAll();
            if(policies){
                logger.info(`handle get policies request`, {req, res, info: `policies found successfully!!`});
                return res.status(200).json(policies);
            }else {
                return res.status(404).json({
                        error: "Not found",
                        message: "policies not found or has been marked deleted"
                    }
                )
            }
        }catch (e) {
            return res.status(404).json({
                    error: "An error occurs",
                    message: "Failed to find policies"
                }
            )
        }
    }
}