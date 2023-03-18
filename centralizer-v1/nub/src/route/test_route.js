import {getRoleRpc, getUserRpc, validatePermission} from "../rabbitmq/rpc_client";
import Application from "../classes/app_class";

export const testPermissionRoute = {
    path: '/api/test-permission/:role/:appSlug',
    method: 'get',
    handler: async (req, res) => {
        try {

            const value = await validatePermission(req.params.role, req.params.appSlug);
            console.log("[NUB] RESPONSE Permission", value)
            return res.status(200).json( JSON.parse(value));
        } catch (e) {
            console.log("[NUB] Error", e)
            return res.status(500).json({message: `An error Occurred!: \r\n ${e}`})
        }

    }
}

export const testGetUserRoute = {
    path: '/api/test-get-user/:userId',
    method: 'get',
    handler: async (req, res) => {
        try {

            const value = await getUserRpc(req.params.userId);
            console.log("[NUB] RESPONSE User", value)
            return res.status(200).json( JSON.parse(value));
        } catch (e) {
            console.log("[NUB] Error", e)
            return res.status(500).json({message: `An error Occurred!: \r\n ${e}`})
        }

    }
}

export const testGetRoleRoute = {
    path: '/api/test-get-role/:role',
    method: 'get',
    handler: async (req, res) => {
        try {
            const app = new Application();

            const value = await app.getAllByRole(req.params.role);
            console.log("[NUB] RESPONSE Test", value)
            return res.status(200).json( value);
        } catch (e) {
            console.log("[NUB] Error", e)
            return res.status(500).json({message: `An error Occurred!: \r\n ${e}`})
        }

    }
}