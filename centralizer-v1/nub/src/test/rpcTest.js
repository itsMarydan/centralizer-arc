import {permissionValidation} from "../external/external_retriever";

const cron = require('node-cron');
const testing = process.env.TESTING || false;
export function rpcTest(){
    if(testing) {
        cron.schedule('* * * * *', () => {
            console.log("RPC Test Cron Job")
            console.log('running a task every minute');
            try {
                permissionValidation("actill8ms0000000", "got-ifehrvnp").then()

            } catch (e) {
                console.log("RPC Test Cron Job Error", e)
            }
            console.log("RPC Test Complete")
            console.log("RPC Test Cron Job : ", new Date())
        });
    }
}