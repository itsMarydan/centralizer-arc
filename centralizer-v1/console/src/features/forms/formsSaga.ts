import {PayloadAction} from "@reduxjs/toolkit";
import {call, put, takeEvery} from "redux-saga/effects";
import {FormSingle} from "../../models/forms";
import {formsApi} from "../../api/formsApi";
import {
    fetchBuilderFailed,
    fetchBuilderSuccess,
    fetchFormListFailed,
    fetchFormListSuccess, fetchFormsFailed, fetchFormsSuccess, fetchSchemaFailed,
    fetchSchemaSuccess
} from "./formsSlice";
import {SchemaObject} from "../../models/contents";

function* fetchBuilder(action: PayloadAction<any>){
    try {
        console.log(action, "here form builder fetch triggered", action.payload)
        const response: FormSingle[] = yield call (
            formsApi.getBuilderBySlug, action.payload.appSlug, action.payload.slug, action.payload.userRole)
        console.log(response)
        yield put(fetchBuilderSuccess(response));

    } catch (error: any) {
        console.log('Failed to fetch form builder', error);
        yield put(fetchBuilderFailed(error.message))
    }
}


function* fetchFormListByApp(action: PayloadAction<string>){
    try {
        console.log(action, "here form list", action.payload)
        const response: FormSingle[] = yield call (
            formsApi.getAllByApp, action.payload)
        console.log(response)
        yield put(fetchFormListSuccess(response));

    } catch (error: any) {
        console.log('Failed to fetch form list', error);
        yield put(fetchFormListFailed(error.message))
    }
}

function* fetchSchema(action: PayloadAction<any>){
    try {
        console.log(action, "schema")
        const response: SchemaObject = yield call (
            formsApi.getSchemaBySlug, action.payload.appSlug, action.payload.slug, action.payload.userRole)
        console.log("i RN EOFV")
        console.log(response)
        yield put(fetchSchemaSuccess(response));

    } catch (error: any) {
        console.log('Failed to fetch content scheme', error);
        yield put(fetchSchemaFailed(error.message))
    }
}

function* fetchForms(action: PayloadAction<any>){
    try {
        console.log(action, "contents")
        const response: any[] = yield call (
            formsApi.getAllFormsBySlug, action.payload.appSlug, action.payload.slug, action.payload.userRole)
        console.log(response)
        yield put(fetchFormsSuccess(response));

    } catch (error: any) {
        console.log('Failed to fetch contents', error);
        yield put(fetchFormsFailed(error.message))
    }
}
export default function* formsSaga() {
    yield takeEvery('forms/fetchBuilder', fetchBuilder);
    yield takeEvery('forms/fetchFormList', fetchFormListByApp);
    yield takeEvery('forms/fetchSchema', fetchSchema);
    yield takeEvery('forms/fetchForms', fetchForms);


}
