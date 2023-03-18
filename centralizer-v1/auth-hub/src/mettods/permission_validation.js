import User from "../classes/user_class";
import Role from "../classes/role_class";
import {PERMISSION_ALL} from "../enums/permissions";

export async function validateUser(userId, appSlug) {

    const aUser = new User();
    aUser.userId = userId;
    const user = await aUser.getUser();
    if (user) {
        const aRole = new Role();
        const role = await aRole.getRole({role: await user.role});
        if (role) {
            return permissionValidate(role, appSlug)
        } else {
            return {
                    permission: false,
                    error: "Role Not Found",
                    message: "Role was not found"
                }

        }
    }else{
        return ({
            permission: false,
            error: "User Not Found",
            message: "User is not valid"
        })
    }
}


export async function validatePermission(theRole, appSlug) {

    if (theRole) {
        const aRole = new Role();
        const role = await aRole.getRole({role: theRole});
        if(!role){
            return {
                permission: false,
                error: "Role Not Found",
                message: "Role was not found"
            }
        }
        if (role) {
            return permissionValidate(role, appSlug)
        }


    }else{
        return ({
            permission: false,
            error: "User Not Found",
            message: "User is not valid"
        })
    }
}

export async function permissionValidate(role, appSlug){

    const isPermissionSuper = role['policies'].find(policy => policy['appLevelPermissions'].includes( PERMISSION_ALL));
    const isPermissionApp = role['policies'].find(policy => policy['appLevelPermissions']. includes(appSlug));
    if (isPermissionSuper || isPermissionApp) {
        return ({permission: true})
    } else {
        return ({permission: false})
    }
}

export async function validateAuthorization(roleId, appSlug, permission, actions){

    const aRole = new Role();
    const role = await aRole.getRole({role: roleId});
    if(!role){
        return {
            permission: false,
            authorization: false,
            error: "Role Not Found",
            message: "Role was not found"
        }
    }

    const isPermitted = (await permissionValidate(role, appSlug)).permission;
    if(!isPermitted){
        return {
            permission: false,
            authorization: false,
            error: "Permission Not Found",
            message: "Permission was not found"
        }
    }







}

export async function authorizedSlugs(roleId){
    const aRole = new Role();
    const role = await aRole.getRole({role: roleId});
    if(!role){
        return {
            permission: false,
            authorization: false,
            error: "Role Not Found",
            message: "Role was not found"
        }
    }
    return await aRole.permittedAppSlugs();
}

