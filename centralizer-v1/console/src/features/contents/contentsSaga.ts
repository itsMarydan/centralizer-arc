import {call, put, take, takeEvery} from "redux-saga/effects";
import contentsApi from "../../api/contentsApi";
import {BuilderAuth, SchemaObject, ContentSingle} from "../../models/contents";
import {
    fetchBuilderFailed,
    fetchBuilderSuccess,
    fetchContentList,
    fetchSchemaSuccess,
    fetchContentListFailed,
    fetchContentListSuccess, fetchSchemaFailed, fetchContentsSuccess, fetchContentsFailed
} from "./contentsSlice";
import {PayloadAction} from "@reduxjs/toolkit";


function* fetchContentListByApp(action: PayloadAction<string>){
    try {
        console.log(action, "here")
        const response: ContentSingle[] = yield call (
            contentsApi.getAllByApp, action.payload)
        console.log(response)
        yield put(fetchContentListSuccess(response));

    } catch (error: any) {
        console.log('Failed to fetch content list', error);
        yield put(fetchContentListFailed(error.message))
    }
}

function* fetchBuilder(action: PayloadAction<any>){
    try {
        console.log(action, "here")
        const response: ContentSingle[] = yield call (
            contentsApi.getBuilderBySlug, action.payload.appSlug, action.payload.slug, action.payload.userRole)
        console.log(response)
        yield put(fetchBuilderSuccess(response));

    } catch (error: any) {
        console.log('Failed to fetch content builder', error);
        yield put(fetchBuilderFailed(error.message))
    }
}

function* fetchSchema(action: PayloadAction<any>){
    try {
        console.log(action, "schema")
        const response: SchemaObject = yield call (
            contentsApi.getSchemaBySlug, action.payload.appSlug, action.payload.slug, action.payload.userRole)
        console.log(response)
        yield put(fetchSchemaSuccess(response));

    } catch (error: any) {
        console.log('Failed to fetch content scheme', error);
        yield put(fetchSchemaFailed(error.message))
    }
}

function* fetchContents(action: PayloadAction<any>){
    try {
        console.log(action, "contents")
        const response: any[] = yield call (
            contentsApi.getAllContentBySlug, action.payload.appSlug, action.payload.slug, action.payload.userRole)
        console.log(response)
        yield put(fetchContentsSuccess(response));

    } catch (error: any) {
        console.log('Failed to fetch contents', error);
        yield put(fetchContentsFailed(error.message))
    }
}
export default function* contentsSaga() {
    yield takeEvery('contents/fetchContentList', fetchContentListByApp);
    yield takeEvery('contents/fetchBuilder', fetchBuilder);
    yield takeEvery('contents/fetchSchema', fetchSchema);
    yield takeEvery('contents/fetchContents', fetchContents);

}
  