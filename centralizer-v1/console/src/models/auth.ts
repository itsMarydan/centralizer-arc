import {User} from "../models/user";
import {Application} from '../models/app'
import { array } from "yup";
export interface Auth{
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
    isLocked: boolean;
}

export interface AuthState{
    isLoggedIn: boolean;
    logging?: boolean;
    currentUser?: Partial<User>;
    userRole?: any;
    userProfile?: Partial<User>;
    permittedApps: Array<Partial<Application>>;
    userOptions: Array<Options>;
    pinnedAppsOrder?: Array<String>;
    appsTableData? : Array<any>;
    appsTableDataLoading?: boolean;
}
export interface AuthPayloadObject{
    user: Partial<User>;
    permittedApps: Array<Partial<Application>>;
    userProfile?: Partial<User>;
    userOptions: Array<Options>;
    pinnedAppsOrder?: Array<String>;
    appsTableData? : Array<any>;
    appsTableDataLoading? : boolean;
    userRole?: any;
}

export interface RoleObject {
    roleId: any,
    roleName: string,
    roleDisplay: string,
    policies: Array<any>,
    roleDelete: boolean,
    roleType: string,
    role: string,
    roleCreator: any
}
export interface LoginObject{
    email: string;
    password: string;
}

export interface SignupObject{
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    key: string;
    password: string
}

export interface AuthToken{
    token: string;
}

export interface Options{
    userId: number,
    optionType: string,
    optionConfig: any
}

export interface OptionsRefresher{
    userOptions: Array<Options>;
    pinnedAppsOrder: [];

}
