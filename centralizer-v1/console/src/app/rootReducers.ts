import userReducer from '../features/user/userSlice';
import authReducer from '../features/auth/authSlice';
import { reducer as formReducer } from 'redux-form';
import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";
import contentsReducer from '../features/contents/contentsSlice'
import formsReducer from '../features/forms/formsSlice'
import authorizeReducer from '../features/authorize/authorizeSlice'
import keyValueReducer from '../features/key-value/keyValueSlice'



const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);
export const rootReducer = {
    user: userReducer,
    auth: persistedReducer,
    form: formReducer,
    contents: contentsReducer,
    forms: formsReducer,
    authorize: authorizeReducer,
    keyValueStore: keyValueReducer,
}



