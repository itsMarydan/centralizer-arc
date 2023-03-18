import User from "../classes/user_class";
import Role from "../classes/role_class";
import {validatePermission} from "../mettods/permission_validation";

export async function retrieveUsersAuthHub(userId) {
    const user = new User();
    user.userId = userId;
    const value = await user.getUser();
    return value;
}


export async function retrieveRoleAuthHub(requestRole) {
    const role = new Role();
    const value = await role.getRole({role: requestRole});
    return value;
}

export async function permissionValidationAuthHub(request) {

    const value = await validatePermission(request.role, request.appSlug)

    return value;

}