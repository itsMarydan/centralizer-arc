import {productionOperation} from "../rabbitmq/amqp_client";

export async function accountCreationConfirmationEmail(message) {
    const exchangeName = 'email-request';
    const exchangeType = 'direct';
   const exchangeDurable = true;
    const queueName = 'emailing_queue';
    const routingKey = 'emailing_route';
    try{
        console.log('send email start')
        await productionOperation(exchangeName, exchangeType,exchangeDurable, message, queueName, routingKey);
        console.log('send email end')
    }catch (e){
        console.error(e)
    }
}

