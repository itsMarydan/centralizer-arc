import {User} from "../models/user";
import {USER_API} from "../static/api-url";
import axiosClient from "./axiosClient";

const userApi = {
    getAll(): Promise<User[]> {
        const url = USER_API.GET_ALL;
        return axiosClient.get(url);
    },
    getById(id: any): Promise<User> {
        const url = USER_API.GET_BY_ID(id);
        return axiosClient.get(url);
      },
    
      add(data: Partial<User>): Promise<User> {
        const url = USER_API.CREATE;
        return axiosClient.post(url, data);
      },
    
      update(id: any,data: Partial<User>): Promise<any> {
        const url = USER_API.UPDATE(id);
        return axiosClient.put(url, data);
      },
}

export default userApi;