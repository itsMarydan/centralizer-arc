import {call, put, takeEvery} from "redux-saga/effects";
import {User} from "../../models/user";
import userApi from "../../api/userApi";
import {fetchUserListFailed, fetchUserListSuccess} from "./userSlice";

function* fetchUserList(){
    console.log('fetching user list')
    try {
        const response: User[] = yield call (
            userApi.getAll)
        yield put(fetchUserListSuccess(response));
    } catch (error: any) {
        console.log('Failed to fetch user List', error);
        yield put(fetchUserListFailed(error.message))
    }
}

export default function* userSaga() {
    yield takeEvery('user/fetchUserList', fetchUserList);

  }
  