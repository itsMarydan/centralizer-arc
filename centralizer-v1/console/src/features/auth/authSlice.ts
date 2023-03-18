import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthPayloadObject, AuthState, LoginObject, OptionsRefresher} from "../../models/auth";
import {RootState} from './../../app/store';

const initialState: AuthState = {
    isLoggedIn: false,
    logging: false,
    currentUser: undefined,
    userProfile: undefined,
    permittedApps:[],
    userOptions: [],
    pinnedAppsOrder: [],
    appsTableData: [],
    appsTableDataLoading: false,
    userRole: undefined
  };



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        login(state, action: PayloadAction<LoginObject>) {
            state.logging = true;
          },
        updateUserInfo(state, action: PayloadAction<string>){
            console.log(action.payload)
        },
        loginSuccess(state, action: PayloadAction<AuthPayloadObject>) {
            state.isLoggedIn = true;
            state.logging = false;
            state.currentUser = action.payload.user;
            state.userProfile = action.payload.userProfile;
            state.permittedApps = action.payload.permittedApps;
            state.userOptions = action.payload.userOptions;
            state.pinnedAppsOrder = action.payload.pinnedAppsOrder;
            state.userRole = action.payload.userRole;
        },
        loginFailed(state, action: PayloadAction<string>) {
            state.logging = false;
            console.log(action.payload);
        },
        updateAppsTableData(state, action: PayloadAction<Array<any>>){
            state.appsTableData = action.payload;
            state.appsTableDataLoading = false;
        },
        updateAppsTableDataDefault(state, action: PayloadAction<Array<any>>){
            state.appsTableData = action.payload;
            state.appsTableDataLoading = false;
        },
        userOptionsRefresh(state){
            console.log("refreshing user options");
        },
        userOptionsRefreshSuccess(state, action: PayloadAction<OptionsRefresher>){
           state.userOptions = action.payload.userOptions;
           console.log("refreshed user options", action.payload.pinnedAppsOrder);
           state.pinnedAppsOrder = action.payload.pinnedAppsOrder;
        },
        updatePinnedAppsOrder(state, action:PayloadAction<Array<String>>){
            state.pinnedAppsOrder = action.payload;
        },
        updatePermittedApps(state, action : PayloadAction<any>){
            state.permittedApps = action.payload;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.currentUser = undefined;
            state.permittedApps = [];
            state.userProfile = undefined;
        }, 
    }
})

export const {login, loginSuccess,updatePinnedAppsOrder,updateAppsTableDataDefault, updateUserInfo, userOptionsRefresh, userOptionsRefreshSuccess, updateAppsTableData, updatePermittedApps, loginFailed, logout } = authSlice.actions;
export const selectLoginLogging = (state: RootState) => state.auth.logging;
export const selectLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectUserProfile = (state: RootState) => state.auth.userProfile;
export const selectPermittedApps = (state: RootState) => state.auth.permittedApps;
export const selectUserOptions = (state: RootState) => state.auth.userOptions;
export const selectPinnedAppOrder = (state: RootState) => state.auth.pinnedAppsOrder;
export const selectAppsTableData = (state: RootState) => state.auth.appsTableData;

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectAppsTableDataLoading = (state: RootState) => state.auth.appsTableDataLoading;
export const selectUserRole = (state: RootState) => state.auth.userRole;

export default authSlice.reducer;