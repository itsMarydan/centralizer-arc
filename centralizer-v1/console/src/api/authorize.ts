import {AUTHORIZE_API} from "../static/api-url";
import axiosClient from "./axiosClient";
import {Policy, Roles, Rules} from "../models/rules";

const authorizeApi = {
    getRules(): Promise<Rules[]> {
        const url = AUTHORIZE_API.GET_RULES;
        return axiosClient.get(url);
    },
    getPolicies(): Promise<Policy[]> {
        const url = AUTHORIZE_API.GET_POLICIES;
        return axiosClient.get(url);
    },
    getRoles(): Promise<Roles[]> {
        const url = AUTHORIZE_API.GET_ROLES;
        return axiosClient.get(url);
    }
}

export default authorizeApi;