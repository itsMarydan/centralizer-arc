import {APPS_API} from "../static/api-url";
import axiosClient from "./axiosClient";
const appsApi = {
    getPermittedAll(role: string): Promise<Array<String>> {
        const url = APPS_API.PERMITTED_APPS(role);
        return axiosClient.get(url);
    },
   async createApp(appName: string, createdBy: number, appStatus: number){
        const url = APPS_API.CREATE_APP;
        try{
           await  axiosClient.post(url,{appName, createdBy, appStatus});
        }catch (e) {
            console.log(e)
        }

    },
   async updateApp(appSlug: string, appStatus: number){
        const url = APPS_API.UPDATE(appSlug);
       try{
           await  axiosClient.put(url,{appStatus});
       }catch (e) {
           console.log(e)
       }
   }

}

export default appsApi;