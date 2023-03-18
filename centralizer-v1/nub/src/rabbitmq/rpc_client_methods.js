import {EventEmitter} from "events";

const uuid = require('uuid');

const amqp = require("amqplib");


export const createClient = (rabbitmqConn) =>
    amqp
        .connect(rabbitmqConn)
        .then(conn => {
            return conn
        });



export const createChannel = (conn, REPLY_QUEUE) => conn.createChannel()
    .then(channel => {
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
        return channel;
    });

export const sendRPCMessage = (channel, message, rpcQueue, REPLY_QUEUE) =>
    new Promise(resolve => {
        const correlationId = uuid.v4();
        channel.responseEmitter.once(correlationId, resolve);
        channel.sendToQueue(rpcQueue, Buffer.from(message), {
            correlationId,
            replyTo: REPLY_QUEUE,
        });
    });