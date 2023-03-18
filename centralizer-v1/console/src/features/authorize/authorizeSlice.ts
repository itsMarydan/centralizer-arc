import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {Policy, Roles, Rules} from "../../models/rules";

export interface AuthorizeState {
    rules: Rules[];
    loadingPolicies: boolean;
    policies: Policy[];
    loadingRoles: boolean;
    roles: Roles[];
    loadingRules: boolean;


}

const initialState: AuthorizeState = {
    rules: [],
    policies: [],
    loadingPolicies: false,
    roles: [],
    loadingRoles: false,
    loadingRules: false,

}

const authorizeSlice = createSlice({
    name: 'authorize',
    initialState,
    reducers: {
        fetchRules: (state) => {
            state.loadingRules = true;
        },
        fetchRulesSuccess: (state, action: PayloadAction<Rules[]>) =>{
            state.rules = action.payload;
        },
        fetchRulesFailure: (state) =>{
            state.loadingRules = false;
        },
        fetchPolicies: (state) =>{
            state.loadingPolicies = true;

        },
        fetchPoliciesSuccess: (state, action: PayloadAction<Policy[]>) =>{
            state.policies = action.payload;
        },
        fetchPoliciesFailure: (state) =>{
            state.loadingPolicies = false;
        },
        fetchRoles: (state) =>{
            state.loadingRoles = true;

        },
        fetchRolesSuccess: (state, action: PayloadAction<Roles[]>) =>{
            state.roles = action.payload;
        },
        fetchRolesFailure: (state) =>{
            state.loadingRoles = false;
        },
    },
});

//  Actions
// export const userActions = userSlice.actions;
export const { fetchPolicies, fetchPoliciesSuccess, fetchPoliciesFailure, fetchRoles,fetchRolesSuccess,fetchRolesFailure, fetchRulesFailure,fetchRules, fetchRulesSuccess } = authorizeSlice.actions;
// Selectors
export const selectRules = (state: RootState) => state.authorize.rules;
export const selectPolicies = (state: RootState) => state.authorize.policies;

export const selectRoles = (state: RootState) => state.authorize.roles;

// Reducer
export default  authorizeSlice.reducer;