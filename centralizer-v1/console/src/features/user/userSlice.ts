import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../../models/user";
import {RootState} from './../../app/store';

export interface UserState {
    loading?: boolean;
    list: User[];

}

const initialState: UserState = {
    loading: false,
    list: [],

}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        fetchUserList: (state ) => {
            state.loading = true;
        },
        fetchUserListSuccess: (state, action: PayloadAction<User[]>) =>{
            state.list = action.payload;
            state.loading = false;
        },
        fetchUserListFailed(state, action: PayloadAction<string>){
            state.loading = false;
        },
    },
});

//  Actions
// export const userActions = userSlice.actions;
export const {fetchUserList, fetchUserListSuccess, fetchUserListFailed } = userSlice.actions;
// Selectors
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserList = (state: RootState) => state.user.list;

// Reducer
export default  userSlice.reducer;