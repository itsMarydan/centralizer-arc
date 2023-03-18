import {EventEmitter} from "events";

const uuid = require('uuid');

const amqp = require('amqplib/callback_api');


export async function createClient (rabbitmqConn) {
    return new Promise((resolve, reject) => {
        amqp.connect(rabbitmqConn, (err, conn) => {
            if (err) {
                console.error("[AMQP]", err.message);
                 reject(err);
                return setTimeout(createClient, 1000);
            } else {
                resolve(conn);
            }
        });
    });
}

export async function createChannel (conn, REPLY_QUEUE) {
    return new Promise((resolve, reject) => {
        conn.createChannel((err, channel) => {
            if (err) {
                console.error("[AMQP]", err.message);
                reject(err);
            } else {
                channel.responseEmitter = new EventEmitter();
                channel.responseEmitter.setMaxListeners(0);
                channel.consume(
                    REPLY_QUEUE,
                    msg => {
                        channel.responseEmitter.emit(
                            msg.properties.correlationId,
                            msg.content.toString(),
                        );
                        console.log("[AMQP] MSG Content", msg.content.toString());
                    },
                    { noAck: true },
                );
                resolve(channel);
            }
        });
    })
}

export async function sendRPCMessage (channel, message, rpcQueue, REPLY_QUEUE) {
    return new Promise(resolve => {
        const correlationId = uuid.v4();
        channel.responseEmitter.once(correlationId, resolve);
        channel.sendToQueue(rpcQueue, Buffer.from(message), {
            correlationId,
            replyTo: REPLY_QUEUE,
        });
    });
}
