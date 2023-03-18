import {processEmail} from "../methods/email_method";

const amqp = require('amqplib/callback_api');
let amqpConnection = null;
const amqp_url = process.env.CLOUDAMQP_URL || 'amqp://localhost:5672';

const queueName = 'emailing_queue';
export  function startAMQPConnectionAndWorkers(){
    console.log(`connecting`);
    amqp.connect(amqp_url + "?heartbeat=60", function (err, connection) {
        if(err){
            console.error("[AMQP]", err.message);
            return setTimeout(startAMQPConnectionAndWorkers, 1000);
        }

        connection.on("error", function (err) {
            if(err.message !== "Connection closing"){
                console.error("[AMQP] Connection Error", err.message);
            }
        });
        connection.on("close", function(){
            console.error("[AMQP] Reconnecting....");
            return setTimeout(startAMQPConnectionAndWorkers, 1000);
        })
        console.log("[AMQP] Connected")
        amqpConnection = connection;
        whenConnected();
    })
}

function whenConnected() {
    startWorkConsumeEmailRequests();
}
function closeOnErr(err) {
    if (!err) return false;
    console.error("[AMQP] Error", err);
    amqpConnection.close();
    return true;
}
function startWorkConsumeEmailRequests(){
    amqpConnection.createChannel(function (err, channel) {
        if(closeOnErr(err)) return;
        channel.on("error", function (err) {
            console.error("[AMQP] Channel Error", err.message);
        })
        channel.on("close", function() {
            console.log("[AMQP] Channel Closed");
        });

        channel.prefetch(10);
        channel.assertQueue(queueName, {durable: true}, function (err, _ok) {
            if(closeOnErr(err)) return;
            channel.consume(queueName, processMsg, { noAck: false } );
            console.log("[AMQP] Consume Email Request Worker is started")
        });

        async function processMsg(msg) {
            await workEmail(msg, function (ok) {
                try {
                    if (ok)
                        channel.ack(msg);
                    else
                        channel.reject(msg, true);
                } catch (e) {
                    closeOnErr(e);
                }
            });
        }
    })
}

async function workEmail(msg, cb) {
    console.log("[AMQP] Consumer JOB", "Emailing Processing.....");
    const email = JSON.parse(msg.content)
    await processEmail(email)
    console.log("[AMQP] Consumer JOB", "Emailing Proceed");

    cb(true);
}