import { all } from 'redux-saga/effects';
import { authSaga } from '../features/auth/authSaga';
import userSaga from '../features/user/userSage';
import contentsSaga from "../features/contents/contentsSaga";
import formsSaga from "../features/forms/formsSaga";
import authorizeSaga from "../features/authorize/authorizeSaga";
import keyValueSaga from "../features/key-value/keyValueSaga";

export default function* rootSaga() {
  yield all([userSaga(), authSaga(), contentsSaga(), formsSaga(), authorizeSaga(), keyValueSaga()]);
}
