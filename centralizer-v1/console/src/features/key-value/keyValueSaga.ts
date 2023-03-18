import {call, put, takeEvery} from "redux-saga/effects";
import {KeyValuePair} from "../../models/key-value";
import keyValueStoreApi from "../../api/keyValueStoreApi";
import {fetchKeyValueListFailed, fetchKeyValueListSuccess} from "./keyValueSlice";

function* fetchKeyValueList(){
    console.log('fetchKeyValueList', "I ran");
    try {
        const response: KeyValuePair[] = yield call (
            keyValueStoreApi.getAll)
        yield put(fetchKeyValueListSuccess(response));
    } catch (error: any) {
        console.log('Failed to fetch KeyValue Store', error);
        yield put(fetchKeyValueListFailed(error.message))
    }
}

export default function* keyValueSaga() {
    yield takeEvery('keyValueStore/fetchKeyValueList', fetchKeyValueList);

}
