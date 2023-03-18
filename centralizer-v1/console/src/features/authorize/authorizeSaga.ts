import {call, put, takeEvery} from "redux-saga/effects";
import {Policy, Roles, Rules} from "../../models/rules";
import authorizeApi from "../../api/authorize";
import {
    fetchPoliciesFailure,
    fetchPoliciesSuccess,
    fetchRolesFailure,
    fetchRolesSuccess, fetchRulesFailure,
    fetchRulesSuccess
} from "./authorizeSlice";

function* getRules(){
    try {
        const response: Rules[] = yield call (
            authorizeApi.getRules)
        yield put(fetchRulesSuccess(response));
    } catch (error: any) {
        console.log('Failed to fetch Rules List', error);
        yield put(fetchRulesFailure());
    }
}

function* getPolicies(){
    try {
        const response: Policy[] = yield call (
            authorizeApi.getPolicies);
        yield put(fetchPoliciesSuccess(response));
    } catch (error: any) {
        console.log('Failed to fetch Policy List', error);
        yield put(fetchPoliciesFailure());
    }
}

function* getRoles(){
    try {
        const response: Roles[] = yield call (
            authorizeApi.getRoles);
        yield put(fetchRolesSuccess(response));
    } catch (error: any) {
        console.log('Failed to fetch Roles List', error);
        yield put(fetchRolesFailure());
    }
}

export default function* authorizeSaga() {
    yield takeEvery('authorize/fetchRules', getRules);
    yield takeEvery('authorize/fetchPolicies', getPolicies);
    yield takeEvery('authorize/fetchRoles', getRoles);

}
