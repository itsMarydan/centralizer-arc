import {RoleSchema} from "../database/mongoose/role_schema";
import {validateUser} from "../mettods/permission_validation";

export const verifyUserAppPermissions = {
    path: '/api/verify-user-permission/:userId/:appSlug',
    method: 'get',
    handler: async (req, res) => {
        const {userId, appSlug} = req.params;
            const result = await  validateUser(userId, appSlug)
        return res.status(200).json(result);
    }
};
export const verifyPermissionByRole ={
    path: '/api/verify-permission-by-role/:role/:appSlug',
    method: 'get',
    handler: async (req, res) => {
        const {role, appSlug} = req.params;
        const verifyRole = await RoleSchema.findOne({role: role});
        if (verifyRole){
            const isPermissionSuper = verifyRole['policies'].find(policy => policy['appLevelPermissions'] === 'all');
            const isPermissionApp = verifyRole['policies'].find(policy => policy['appLevelPermissions'] === appSlug);
            if (isPermissionSuper || isPermissionApp) {
                return res.status(200).json({permission: true})
            } else {
                return res.status(200).json({permission: false})
            }
        }else{
            return res.status(404).json({
                    error: "Role Not Found",
                    message: "Role was not found"
                }
            )
        }
    }
}