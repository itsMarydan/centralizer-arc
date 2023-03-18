import {PayloadAction} from "@reduxjs/toolkit";
import {call, fork, put, take, takeEvery} from "redux-saga/effects";
import authApi from '../../api/authApi'
import {AuthPayloadObject, AuthToken, LoginObject, Options, OptionsRefresher, RoleObject} from "../../models/auth";
import {User} from "../../models/user";
import {login, loginFailed, loginSuccess, logout, updateUserInfo, userOptionsRefreshSuccess} from "./authSlice";
import {getCookie, removeCookie} from 'typescript-cookie';
import jwtDecode from "jwt-decode";
import {AUTH_TOKEN} from "../../static/token";
import appsApi from '../../api/appsApi';
import {Application} from "../../models/app";
import userApi from "../../api/userApi";
import {userUtils as optionsName} from "../../static/user-utils";
import setCookie from "../custom-cookies";

function*  handleUserUpdate() {
  console.log("user update ran")
  const token = getCookie(AUTH_TOKEN)
  console.log("Token after set", token)
  const user = getCurrentUser(token, getPayloadFromToken);
  console.log(user, "user")
  const userProfile: User = yield call(getUser, user.userId)
  const permittedApps: Array<Partial<Application>> = yield call(appsApi.getPermittedAll, user.role) ;
  const userOptions: Array<Options> = yield call(authApi.retrieveOptions, user.userId);
  const  userRole: RoleObject = yield call(authApi.getRoleByRole, user.role);
  const pinnedAppsOptions = userOptions.find(option => option.optionType === optionsName.PINNED_APPS);
  const unvalidatedPinnedAppsOrder = pinnedAppsOptions?.optionConfig.appOrder;
  console.log("unvalidatedPinnedAppsOrder", unvalidatedPinnedAppsOrder)
  console.log("permittedApps", permittedApps)

  console.log("user being passed in", user)
  const pinnedAppsOrder =  permittedApps.length > 0 && unvalidatedPinnedAppsOrder ? intersection(unvalidatedPinnedAppsOrder, permittedApps) : [];

  const authValues: AuthPayloadObject ={
    user,
    permittedApps,
    userProfile,
    userOptions,
    pinnedAppsOrder,
    userRole
  }
  yield put(loginSuccess(authValues));

}



const getPayloadFromToken = (token: any) => {
  // const encodedPayload = token.split('.')[1];
  return jwtDecode(token);
}

function getCurrentUser(token: any, getPayloadFromToken: any) {
  if (!token) return null;
  return getPayloadFromToken(token);
}

async function getUser(userId: number){
  const user: any = await userApi.getById(userId);
  return user.retrievedUser
}

function* handleLogin(payload: LoginObject) {
  try {

    const response: AuthToken  = yield call(authApi.login, payload);

    console.log("response with token", response.token)

     setCookie(AUTH_TOKEN, response.token);

    const token = getCookie(AUTH_TOKEN)

    console.log("Token after set", token)

    const user = getCurrentUser(token, getPayloadFromToken);
    const userProfile: User = yield call(getUser, user.userId)
    const permittedApps: Array<Partial<Application>> = yield call(appsApi.getPermittedAll, user.role);
    const userOptions: Array<Options> = yield call(authApi.retrieveOptions, user.userId);
    const  userRole: RoleObject = yield call(authApi.getRoleByRole, user.role);
    const pinnedAppsOptions = userOptions.find(option => option.optionType === optionsName.PINNED_APPS);
    console.log(pinnedAppsOptions)
    const unvalidatedPinnedAppsOrder = pinnedAppsOptions?.optionConfig.appOrder;
    const pinnedAppsOrder = getDifference(unvalidatedPinnedAppsOrder, permittedApps)
    const authValues: AuthPayloadObject ={
      user,
      permittedApps,
      userProfile,
      userOptions,
      pinnedAppsOrder,
      userRole
    }
    yield put(loginSuccess(authValues));

  } catch (error: any) {
    yield put(loginFailed(error.message)); // Dispatch action
  }
}

function* handleLogout() {

  removeCookie(AUTH_TOKEN)
  yield call(logout)
}

function getDifference(array1: any, array2:any) {
  return array1.filter((item: any) => {
    return array2.some((object: any) => {
      return item === object.appSlug;
    });
  });
}
function intersection (arr1: any, arr2: any) {
  if(!arr1) return [];
  console.log("arr1", arr1)
  console.log("arr2", arr2)
  if(!arr2) return arr1;
  return   arr1.filter((item1: any) => arr2.some((item2: any) => item1 === item2.appSlug))
}
function* watchLoginFlow() {
  while (true) {
    const isLoggedIn = Boolean(getCookie(AUTH_TOKEN));

    if (!isLoggedIn) {
      const action: PayloadAction<LoginObject> = yield take(login.type);
      yield fork(handleLogin, action.payload); // Non-blocking
    }
    if(isLoggedIn){
      const token = getCookie(AUTH_TOKEN)
      const user = getCurrentUser(token, getPayloadFromToken);
      console.log(user, "user")
      const userProfile: User = yield call(getUser, user.userId)
      const permittedApps: Array<Partial<Application>> = yield call(appsApi.getPermittedAll, user.role) ;
      const userOptions: Array<Options> = yield call(authApi.retrieveOptions, user.userId);
      const  userRole: RoleObject = yield call(authApi.getRoleByRole, user.role);
      const pinnedAppsOptionsArray = userOptions.filter(option => option.optionType === optionsName.PINNED_APPS);
        const pinnedAppsOptions = pinnedAppsOptionsArray[0];
      const unvalidatedPinnedAppsOrder = pinnedAppsOptions?.optionConfig.appOrder;
      console.log("unvalidatedPinnedAppsOrder", unvalidatedPinnedAppsOrder)
      console.log("permittedApps", permittedApps)

      const pinnedAppsOrder =  permittedApps.length > 0 && unvalidatedPinnedAppsOrder ? intersection(unvalidatedPinnedAppsOrder, permittedApps) : [];

      const authValues: AuthPayloadObject ={
        user,
        permittedApps,
        userProfile,
        userOptions,
        pinnedAppsOrder,
        userRole
      }
      yield put(loginSuccess(authValues));
    }
    yield take(logout.type);
    yield call(handleLogout); // Blocking - wait for the logout function to finish before continuing to watch watchLoginFlow
  }
}
function* handleUserOptionRefresh() {
  console.log("user option refresh ran")
  const token = getCookie(AUTH_TOKEN)
  if(!token) {
    yield call(logout);
  } else {

    console.log(token, "token")
    const user = getCurrentUser(token, getPayloadFromToken);
    console.log(user, "user from the payload")

    const permittedApps: Array<Partial<Application>> = yield call(appsApi.getPermittedAll, user.role) ;
    const userOptions: Array<Options> = yield call(authApi.retrieveOptions, user.userId);
    const pinnedAppsOptions = userOptions.find(option => option.optionType === optionsName.PINNED_APPS);
    const unvalidatedPinnedAppsOrder = pinnedAppsOptions?.optionConfig.appOrder;
    console.log("permittedApps", permittedApps)
    console.log("userOptions", userOptions, "userId", user.userId)
    console.log("unvalidatedPinnedAppsOrder", unvalidatedPinnedAppsOrder)
    console.log("pinnedAppOrder conditional",   permittedApps?.length > 0 && unvalidatedPinnedAppsOrder?.length > 0  )
    const pinnedAppsOrder =  permittedApps?.length > 0 && unvalidatedPinnedAppsOrder?.length > 0 ? intersection(unvalidatedPinnedAppsOrder, permittedApps) : [];
    console.log("pinnedAppsOrder by function", intersection(unvalidatedPinnedAppsOrder, permittedApps) )
    console.log("pinnedAppsOrder after validating conditional", pinnedAppsOrder)

    const optionsPayload: OptionsRefresher = {userOptions, pinnedAppsOrder};
    console.log("optionsPayload", optionsPayload)
    yield put(userOptionsRefreshSuccess(optionsPayload));
  }

}
export function* authSaga() {
  yield fork(watchLoginFlow);
  yield takeEvery('auth/logout', handleLogout)
  yield takeEvery('auth/updateUserInfo', handleUserUpdate)
  yield takeEvery('auth/userOptionsRefresh', handleUserOptionRefresh)
}
