import {
    createUserRoute,
    findUser,
    findUsers,
    forgotPassword,
    logInRoute, resetPassword,
    updateUserInfoRoute,
    verifyEmail,
} from "./route/user_route";
import {
    createRole,
    getRoleByRole,
    deleteRole,
    getAllRole,
    getAllRoleWithDeleted,
    getRole,
    softDeleteRole,
    updateRole, loadRoles
} from "./route/role_route";
import {createPolicy, getAllPolicy, getPolicy, loadPolices} from "./route/policy_route";
import {verifyUserAppPermissions, verifyPermissionByRole} from "./route/permission_route";
import {createOption, getOption, updateOption, validateOption, getUserOption} from "./route/options_route";
import {createRule, deleteRule, getRule, getRules, loadRules, updateRule} from "./route/rule_route";
import {develop} from "./route/develop";
import {health} from "./route/health";


export const routes = [
    health,
    resetPassword,
    forgotPassword,
    verifyEmail,
    createUserRoute,
    logInRoute,
    findUser,
    findUsers,
    updateUserInfoRoute,
    createRole,
    getRoleByRole,
    getRole,
    deleteRole,
    updateRole,
    getAllRole,
    createPolicy,
    getPolicy,
    getAllPolicy,
    verifyUserAppPermissions,
    verifyPermissionByRole,
    getAllRoleWithDeleted,
    softDeleteRole,
    getOption,
    createOption,
    updateOption,
    validateOption,
    getUserOption,
    loadRules,
    updateRule,
    getRules,
    getRule,
    createRule,
    deleteRule,
    develop,
    loadRoles,
    loadPolices

]