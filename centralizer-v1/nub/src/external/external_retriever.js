import {logger} from "../logger/winson";
import {getUserRpc, validatePermission} from "../rabbitmq/rpc_client";

export const getUser = async (id) => {
    try {
        const value =  await getUserRpc(id);
        return JSON.parse(value);
    } catch (error) {
        logger.error(error)
        return false;
    }
}

export async function permissionValidation(role, appSlug) {
    const value = await validatePermission(role, appSlug);

    if(value.error){
       return false;
    }

    return JSON.parse(value).permission;
}