import Settings from "../classes/settings_class";


const amqplib = require('amqplib/callback_api');
const amqp_url = process.env.CLOUDAMQP_URL || 'amqp://localhost:5672';

export const processSettingsRetrieve = async () => {
   await amqplib.connect(amqp_url, async function (error0, connection) {
        if (error0) {
            throw error0;
        }
        await connection.createChannel(async function (error1, channel) {
            if (error1) {
                throw error1;
            }

            const queue = 'rpc_queue';
            channel.assertQueue(queue, {durable: false});
            channel.prefetch(1);
            console.log(' [AMQP_RPC] Awaiting RPC requests');
            await channel.consume(queue, async function reply(msg) {
                const request = msg.content.toString();

                console.log("[AMQP_RPC] Request", request)
                const value = await retrieveSettingsByTypeMethod(request);

                console.log("[SYSTEM ENGINE] value", value.toString());
                channel.sendToQueue(msg.properties.replyTo, Buffer.from(value.toString()), {
                    correlationId: msg.properties.correlationId
                });
                channel.ack(msg);

            })
        });

    });
}


async function retrieveSettingsByTypeMethod(settingsType) {
    const newSettings = new Settings();
    newSettings.settingsType = settingsType;
    try {
        return await newSettings.retrieveSettingsByType();
    }catch (e) {
        console.error ( "[AMQP] Error on retrieve", e )
       return false
    }

}