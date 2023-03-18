// import {createChannel, createClient, sendRPCMessage} from "./rpc_client_methods";
import {createChannel, createClient, sendRPCMessage} from "./rpc_method";


const RABBITMQ =  process.env.AMQP_URL || 'amqp://localhost:5672';


// Method: validatePermission
// Description: Validate if the user has permission to access the resource
// Parameters: (role, appSlug )
// Return: (true/false)
export const validatePermission = async (role, appSlug) => {
    const REPLY_QUEUE = 'validate-permission-rpc';
    const q = 'validate-permission-rpc';

    const message = {role, appSlug};

    const conn = await createClient(RABBITMQ);

     const channel  = await createChannel(conn, REPLY_QUEUE);

    console.log(`[ ${new Date()} ] Message sent: ${JSON.stringify(message)}`);

    const response = await sendRPCMessage(channel, JSON.stringify({role, appSlug}), q, REPLY_QUEUE);

    console.log(`[ ${new Date()} ] Message received: ${response}`);

    channel.close();
    conn.close()
    console.log("[AMQP] INFO: ", "Connection Closed on Client after request end")
    console.log(`[NUB] RPC RESPONSE: `, response)
    return response;

};



export const getUserRpc = async (userId) => {
    const reply_queue = 'retrieve-user-rpc';
    const q = 'retrieve-user-rpc';

    const conn = await createClient(RABBITMQ);

    const channel  = await createChannel(conn, reply_queue);

    const message = {userId};

    console.log(`[ ${new Date()} ] Message sent: ${JSON.stringify(message)}`);

    const response = await sendRPCMessage(channel, JSON.stringify({userId}), q, reply_queue);

    channel.close();
    conn.close();
    console.log("[NUB] RPC RESPONSE: ", response)
    return response;
}


export const getRoleRpc = async (role) => {
    const reply_queue = 'retrieve.role.rpc';
    const queue = 'retrieve.role.rpc';

    const conn = await createClient(RABBITMQ);

    console.log("[NUB]  Conn: ", conn)
    const channel  = await createChannel(conn, reply_queue);
    const message = {role};

    const stringifyMessage = JSON.stringify(message);
    console.log("[NUB] Message Sent for Role Retrieve RPC: ",  stringifyMessage)
    const response = await sendRPCMessage(channel, stringifyMessage, queue, reply_queue);
    channel.close();
    conn.close();
    console.log("[NUB] RPC RESPONSE: ", response)
    return response;
}

export const getPermittedAppsRpc = async (role) => {
    const reply_queue = 'retrieve.permitted.apps.rpc';
    const queue = 'retrieve.permitted.apps.rpc';

    const conn = await createClient(RABBITMQ);

    const channel  = await createChannel(conn, reply_queue);
    const message = {role};

    const stringifyMessage = JSON.stringify(message);
    console.log("[NUB] Message Sent for Permitted Apps Retrieve RPC: ",  stringifyMessage)
    const response = await sendRPCMessage(channel, stringifyMessage, queue, reply_queue);
    channel.close();
    conn.close();
    console.log("[NUB] RPC RESPONSE: ", response)
    return response;

}