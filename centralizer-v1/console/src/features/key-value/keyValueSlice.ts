import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from './../../app/store';
import {KeyValuePair} from "../../models/key-value";

export interface KeyValueStoreState {
    loading?: boolean;
    list: KeyValuePair[];

}

const initialState: KeyValueStoreState = {
    loading: false,
    list: [],

}

const keyValueSlice = createSlice({
    name: 'keyValueStore',
    initialState,
    reducers: {
        fetchKeyValueList: (state ) => {
            state.loading = true;
        },
        fetchKeyValueListSuccess: (state, action: PayloadAction<KeyValuePair[]>) =>{
            state.list = action.payload;
            state.loading = false;
        },
        fetchKeyValueListFailed(state, action: PayloadAction<string>){
            state.loading = false;
        },
    },
});

//  Actions

export const {fetchKeyValueList, fetchKeyValueListSuccess, fetchKeyValueListFailed } = keyValueSlice.actions;
// Selectors
export const selectKeyValueStoreLoading = (state: RootState) => state.keyValueStore.loading;
export const selectKeyValueStore = (state: RootState) => state.keyValueStore.list;

// Reducer
export default  keyValueSlice.reducer;