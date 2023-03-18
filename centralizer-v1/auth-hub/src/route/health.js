import Policy from "../classes/policy_class";
import {logger} from "../logger/winson";

export const health = {
    path: '/api/auth-health',
    method: 'post',
    handler: async (req, res) => {
            return res.status(200).json({message: `Auth service is up and running`})
    }
}