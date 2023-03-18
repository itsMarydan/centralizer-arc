import {logger} from "../logger/winson";
import Role from "../classes/role_class";
import Rule from "../classes/rule_class";
export const createRole = {
    path: '/api/create-role',
    method: 'post',
    handler: async (req, res) => {
        const {roleName, roleDisplay, policies, roleType, roleCreator} = req.body;
        const aRole = new Role(roleName, roleDisplay, policies, roleType, roleCreator);
        const isDuplicate = await aRole.checkForDuplicate();
        if (isDuplicate) return res.status(500).json({
            error: "Duplicate role",
            message: "roleDisplay and roleName must have unique values"
        });
            try {

                await aRole.create();
                logger.info('handle method save new role', {info: `new role was created successfully!!`})
            } catch (err) {
                logger.error('handle request create new role', {req, res, error: err});
            }
            logger.info('handle request create new role', {req, res, info: "Success!"});
            return res.status(200).json({message: "Success!"})
        }

};
export const updateRole = {
    path: '/api/update-role/:roleId',
    method: 'put',
    handler: async (req, res) => {
        const roleId = req.params.roleId;
        const updates = req.body;
        const aRole = new Role();
        const role = await aRole.getRole({roleId: roleId, roleDelete: false});
        if (role) {
            if (role.roleCreator === 'system') {
                return res.status(500).json({
                        error: "Not permitted to complete this action",
                        message: "System generated role, you are not permitted to update this role!"
                    }
                )
            } else {
                if (updates.hasOwnProperty('roleId') || updates.hasOwnProperty('roleName' )
                    || updates.hasOwnProperty( 'roleDisplay' ) ||  updates.hasOwnProperty( 'roleDisplay')) {
                    return res.status(500).json({
                            error: "Not permitted to complete this action",
                            message: "You are not permitted to update roleId, roleName, roleDisplay or roleDelete"
                        }
                    )
                } else {
                    try {
                        await aRole.findAndUpdate({roleId: roleId, roleDelete: false}, updates);
                    } catch (err) {
                        logger.error(`handle update role request`, {req, res, error: err});
                        return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
                    }
                    logger.info(`handle update role request`, {req, res, info: `role was updated successfully!!`});
                    return res.status(200).json({message: "Success!"})
                }
            }
        }else{
            return res.status(500).json({
                    error: "Not Found",
                    message: "This role does not exist or has been marked as deleted"
                }
            )
        }
    }
};
export const getRole = {
    path: '/api/role/:roleId',
    method: 'get',
    handler: async (req, res) => {
        const aRole = new Role();
        aRole.roleId = req.params.roleId;
        try {
            const role = await aRole.getRole({roleId: parseInt(req.params.roleId), roleDelete: false});
            if(role){
                logger.info(`handle get role request`, {req, res, info: `role was found successfully!!`});
                return res.status(200).json(role);
            }else{
                return res.status(404).json({
                        error: "Not found",
                        message: "Role does not exist or has been marked deleted"
                    }
                )
            }

        } catch (err) {
            logger.error(`handle get role request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }

    }
}
export const getRoleByRole = {
    path: '/api/role-by-role/:role',
    method: 'get',
    handler: async (req, res) => {
        const aRole = new Role();
        aRole.roleId = req.params.roleId;
        try {
            const role = await aRole.getRole({role: req.params.role, roleDelete: false});
            if(role){
                logger.info(`handle get role request`, {req, res, info: `role was found successfully!!`});
                return res.status(200).json(role);
            }else{
                return res.status(404).json({
                        error: "Not found",
                        message: "Role does not exist or has been marked deleted"
                    }
                )
            }

        } catch (err) {
            logger.error(`handle get role request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }

    }
}
export const getAllRole = {
    path: '/api/roles',
    method: 'get',
    handler: async (req, res) => {
        try {
            const aRole = new Role();
            const role = await aRole.getAllWithSoftDeleteFlag();
            logger.info(`handle get all roles request`, {req, res, info: `roles found successfully!!`});
            return res.status(200).json(role);
        } catch (err) {
            logger.error(`handle get all roles request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }

    }
}
export const loadRoles = {
    path: '/api/roles',
    method: 'post',
    handler: async (req, res) => {
        const aRole = new Role();
        try {
            const rules = await aRole.loadRoles();
            return res.status(200).json(rules);
        } catch (err) {
            logger.error(`handle load role request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
    }

}
export const getAllRoleWithDeleted = {
    path: '/api/roles-with-deleted',
    method: 'get',
    handler: async (req, res) => {
        try {
            const aRole = new Role();
            const role = await aRole.getAll();
            logger.info(`handle get all roles request`, {req, res, info: `roles found successfully!!`});
            return res.status(200).json(role);
        } catch (err) {
            logger.error(`handle get all roles request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }

    }
}
export const softDeleteRole = {
    path: '/api/soft-delete-role/:roleId',
    method: 'delete',
    handler: async (req, res) => {
        const roleId = req.params.roleId;
        const aRole = new Role();
        aRole.roleId = roleId;
        const role = await aRole.getRole({roleId: roleId, roleDelete: false});
        if (role.roleCreator === 'system') {
            return res.status(500).json({
                    error: "System generated role",
                    message: "You are not permitted to delete this role!"
                }
            )
        } else {
            try {
                await aRole.softDelete();
            } catch (err) {
                logger.error(`handle delete role request`, {req, res, error: err});
                return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
            }
            logger.info(`handle delete role request`, {req, res, info: `role was deleted successfully!!`});
            return res.status(200).json({message: "Success!"})
        }
    }
}
export const deleteRole = {
    path: '/api/delete-role/:roleId',
    method: 'delete',
    handler: async (req, res) => {
        const roleId = req.params.roleId;
        const aRole = new Role();
        aRole.roleId = roleId;
        const role = await aRole.getRole({roleId: roleId, roleDelete: false});
        if (role.roleCreator === 'system') {
            return res.status(500).json({
                    error: "System generated role",
                    message: "You are not permitted to delete this role!"
                }
            )
        } else {
            try {
                await aRole.hardDelete();
            } catch (err) {
                logger.error(`handle delete role request`, {req, res, error: err});
                return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
            }
            logger.info(`handle delete role request`, {req, res, info: `role was deleted successfully!!`});
            return res.status(200).json({message: "Success!"})
        }
    }
}