import {User} from "../models/user";
import {KEY_VALUE_API, USER_API} from "../static/api-url";
import axiosClient from "./axiosClient";
import {KeyValuePair} from "../models/key-value";

const keyValueStoreApi = {
    getAll(): Promise<KeyValuePair[]> {
        const url = KEY_VALUE_API.GET_ALL;
        return axiosClient.get(url);
    },
    getByKey(key: string): Promise<KeyValuePair> {
        const url = KEY_VALUE_API.GET_BY_KEY(key);
        return axiosClient.get(url);
    },
    update(key: string,data: Partial<KeyValuePair>): Promise<any> {
        const url = KEY_VALUE_API.UPDATE(key);
        return axiosClient.put(url, data);
    },
}

export default keyValueStoreApi;