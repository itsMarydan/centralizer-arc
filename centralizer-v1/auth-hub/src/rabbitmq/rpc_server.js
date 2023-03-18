
import { validatePermission } from "../mettods/permission_validation";
import User from "../classes/user_class";
import Role from "../classes/role_class";
import {isPermittedTOAccessApp} from "../database/mongo/methods/permissions";


const amqplib = require('amqplib/callback_api');
const amqp_url = process.env.AMQP_URL || 'amqp://localhost:5672';


export async function  rpcServer(){
     amqplib.connect(amqp_url + "?heartbeat=60", async function (error0, connection) {
        if (error0) {
            console.error("[AMQP]", error0.message);
            return setTimeout(rpcServer, 1000);
        }

        connection.on("error", function(err) {
            if (err.message !== "Connection closing") {
              console.error("[AMQP] connection error", err.message);
            }
          });

          connection.on("close", function() {
            console.error("[AMQP] reconnecting");
            return setTimeout(rpcServer, 1000);
          });

         await connection.createChannel(async function (error1, channel) {
             if (error1) {
                 console.error("[AMQP]", error1.message);
                 return setTimeout(rpcServer, 1000);
             }
             console.log("[AMQP] RPC server is listening")
             try {
                 await whenConnected(channel);
             } catch (e) {
                 console.log("[AMQP]  Server Error", e)
             }

         });

    });


}

async function whenConnected(channel) {
    await workPermissionValidation(channel);
    await workRetrieveUser(channel);
    await workRetrieveRole(channel);
    await workRetrievePermittedApps(channel);
}
async function workRetrieveUser(channel){
    const queue = 'retrieve-user-rpc';
    channel.assertQueue(queue, {durable: false});
    channel.prefetch(1);
    console.log(' [AMQP_RPC] Awaiting RPC requests for Retrieve User');
    await channel.consume(queue, async function reply(msg) {
        const request = JSON.parse(msg.content);

        console.log("[AMQP_RPC] Request", await request)

        console.log("[AMQP_RPC] Request", )

        const user = new User();
        user.userId =request.userId;
        const value = await user.getUser();

        console.log("[AUTH  HUB] Response for Retrieve User", JSON.stringify(value));
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(value)), {
            correlationId: msg.properties.correlationId
        });
        channel.ack(msg);

    })
}

async  function workRetrieveRole(channel){
    const queue = 'retrieve.role.rpc';
    channel.assertQueue(queue, {durable: false});
    channel.prefetch(1);
    console.log("[AMQP_RPC] Await RPC Request Retrieve Role")
    await channel.consume(queue, async function reply(msg) {

        const request = JSON.parse(msg.content);
        console.log("[AMQP_RPC] Request", await request)

        console.log("[AMQP_RPC] Request", )

        const role = new Role();

        const value = await role.getRole({role: request.role});

        console.log("[AUTH  HUB] Response for Retrieve Role", JSON.stringify(value));
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(value)), {
            correlationId: msg.properties.correlationId
        });
        channel.ack(msg);
    })


}

async function workRetrievePermittedApps(channel){
    const queue = 'retrieve.permitted.apps.rpc';
    channel.assertQueue(queue, {durable: false});
    channel.prefetch(1);
    console.log(' [AMQP_RPC] Awaiting RPC requests for Retrieve Permitted Apps');
    await channel.consume(queue, async function reply(msg) {
        const request = JSON.parse(msg.content);

        console.log("[AMQP_RPC] Request", await request)

        const aRole = new Role();
        const role = await aRole.getRole({role: request.role});
        console.log("[AMQP_RPC] Request role value: ", role )
        aRole.roleId = parseInt(role.roleId);
        console.log("[AMQP_RPC] Request role ID value: ", aRole.roleId )
        const value = await aRole.permittedAppSlugs();

        console.log("[AUTH  HUB] Response for  Permitted Apps", JSON.stringify(value));
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(value)), {
            correlationId: msg.properties.correlationId
        });
        channel.ack(msg);

    })
}

async function workPermissionValidation(channel) {
    const queue = 'validate-permission-rpc';
    channel.assertQueue(queue, {durable: false});
    channel.prefetch(1);
    console.log(' [AMQP_RPC] Awaiting RPC requests for Validate Permission');
    await channel.consume(queue, async function reply(msg) {
        const request = JSON.parse(msg.content);

        console.log("[AMQP_RPC] Request", await request)

        const aRole = new Role();
        const role = await aRole.getRole({role: request.role});

        // console.log("[AMQP_RPC] Request role ID value: ", role.roleId )

        const value = await isPermittedTOAccessApp(role.roleId, request.appSlug)

        console.log("[AUTH  HUB] Response for Validate Permission", JSON.stringify(value));
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(value)), {
            correlationId: msg.properties.correlationId
        });
        channel.ack(msg);

    })

}
