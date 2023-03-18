import {AuthToken, LoginObject, Options, RoleObject, SignupObject} from "../models/auth";
import {ErrorHandlerMessage} from "../models/commons";
import {AUTH_API} from "../static/api-url";
import axiosClient from "./axiosClient";

const authApi = {
    login(params: LoginObject): Promise<AuthToken> {
        const url = AUTH_API.LOGIN;
        return axiosClient.post(url,
            params
        );
    },
    signup(params: SignupObject): Promise<AuthToken>  {
        const url = AUTH_API.SIGNUP;
        return axiosClient.post(url,params);
    },
    verifyEmail(verificationString: string): Promise<AuthToken> {
        const url = AUTH_API.VERIFY_EMAIL(verificationString);
        return axiosClient.put(url);
      },
      passwordReset(resetCode: string, newPassword: string): ErrorHandlerMessage {
        const url = AUTH_API.RESET_PASS(resetCode);
        try{
            axiosClient.put(url, {
                newPassword
            });
            return ({ isError: false, message: "success"})
        }catch(error: any){
            return ({ isError: true, message: error.message})
        }     
      },
      passwordResetAsAdmin(email: string, newPassword: string): ErrorHandlerMessage {
        const url = AUTH_API.REST_PASS_ADMIN(email);
        try{
            axiosClient.put(url, {
                newPassword
            });
            return ({ isError: false, message: "success"})
        }catch(error: any){
            return ({ isError: true, message: error.message})
        }
      },
      forgotPassword(email: string): ErrorHandlerMessage {
        const url = AUTH_API.FORGOT_PASS(email);
        try {  
            axiosClient.put(url);
            return ({ isError: false, message: "success"})
        } catch (error: any) {
            return ({ isError: true, message: error.message}) 
        }
      },
      retrieveOptions(userId: number): Promise<Options[]>{
        const url = AUTH_API.GET_USER_OPTIONS(userId);
            return axiosClient.get(url);
      },
      updateOptions(userId: number, optionType: string, updates: any): ErrorHandlerMessage{
        const url = AUTH_API.UPDATE_OPTIONS(userId, optionType);
        try {
           const result = axiosClient.put(url, updates)
            return ({ isError: false, message: `success: ${result}`})
        } catch (error: any) {
            return ({ isError: true, message: error.message}) 
        }
      },
    getRoleByRole(role: string): Promise<RoleObject>{
        const url = AUTH_API.GET_ROLE_BY_ROLE(role);
        return axiosClient.get(url);
    }
}

export default authApi;