const amqplib = require('amqplib');

const amqp_url = process.env.AMQP_URL || 'amqp://localhost:5672';

async function connectAndWorkRabbitMQ(productionOperation){
    const connection = await amqplib.connect(amqp_url, "heartbeat=60");
    const channel = await connection.createChannel()
    await productionOperation(channel);
    console.log("[AMQP] Publishing Worker")
    setTimeout( function()  {
        channel.close();
        connection.close();},  500 );
}

export async function productionOperation(exchangeName, exchangeType, exchangeDurable,message, queueName,routingKey ) {
   await connectAndWorkRabbitMQ(async channel =>{
       await channel.assertExchange(exchangeName, exchangeType, {durable: exchangeDurable}).catch(console.error);
       await channel.assertQueue(queueName, {durable: true});
       await channel.bindQueue(queueName, exchangeName, routingKey);
       await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
    })
}