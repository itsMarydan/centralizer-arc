import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FormSingle} from "../../models/forms";
import {RootState} from "../../app/store";
import {SchemaObject} from "../../models/contents";

export interface FormsState {
    loading?: boolean;
    list: FormSingle[];
    builderLoading: boolean;
    builder: any;
    editing: any;
    identifiers: any;
    schema: any;
    schemaLoading: boolean;
    forms: any;
    formsLoading: boolean;
    fileGallery: any;
    form: any;
    inputs: any
}

const initialState: FormsState = {
    loading: false,
    list: [],
    builderLoading: false,
    builder: {},
    editing: {},
    identifiers: {},
    schema:{},
    schemaLoading: false,
    forms: [],
    formsLoading: false,
    fileGallery: [],
    form: {},
    inputs: {}
}

const formsSlice = createSlice({
    name: 'forms',
    initialState,
    reducers: {
        fetchFormList: (state,action:PayloadAction<string>) => {
            state.loading = true;
        },
        fetchFormListSuccess: (state, action: PayloadAction<FormSingle[]>) =>{
            state.list = action.payload;
            state.loading = false;
        },
        fetchFormListFailed(state, action: PayloadAction<string>){
            state.loading = false;
        },
        fetchBuilder: (state, action:PayloadAction<any> ) => {
            state.builderLoading = true;
        },
        fetchBuilderSuccess: (state, action: PayloadAction<FormSingle[]>) =>{
            state.builder = action.payload;
            state.builderLoading = false;
        },
        fetchBuilderFailed(state, action: PayloadAction<string>){
            state.builderLoading = false;
        },
        fetchSchema: (state, action:PayloadAction<any>) =>{
            state.schemaLoading = true;
        },
        fetchSchemaSuccess: (state, action: PayloadAction<SchemaObject>) => {
            state.schema = action.payload;
            state.schemaLoading = false;
        },
        fetchSchemaFailed(state, action: PayloadAction<string>){
            state.schemaLoading = false;
        },
        fetchForms:(state, action: PayloadAction<any>)=>{
            state.formsLoading = true;
        },
        fetchFormsSuccess:(state, action: PayloadAction<any>)=>{
            state.forms = action.payload;
            state.formsLoading = false;

        },
        fetchFormsFailed: (state, action: PayloadAction<string>)=>{
            state.formsLoading = false;
        },
        setEditing: (state, action:PayloadAction<any>) => {
            state.editing = action.payload;
        },
        addInputs(state, action: PayloadAction<any>) {
            state.inputs = action.payload;
        }
    }
})

export const { addInputs,fetchFormList,fetchFormListSuccess,fetchFormListFailed, fetchBuilder, fetchBuilderSuccess, fetchBuilderFailed,
    fetchSchema,fetchSchemaSuccess, fetchSchemaFailed,fetchForms,fetchFormsSuccess,fetchFormsFailed,setEditing} = formsSlice.actions;

export const selectForms = (state: RootState) => state.forms.forms;
export const selectFormsList = (state: RootState) => state.forms.list;
export const selectFormsLoading = (state: RootState) => state.forms.loading;
export const selectFormsBuilder = (state: RootState) => state.forms.builder;
export const selectFormsBuilderLoading = (state: RootState) => state.forms.builderLoading;
export const selectEditing = (state: RootState) => state.contents.editing;
export const selectSchema = (state: RootState) => state.forms.schema;

export const selectInputs = (state: RootState) => state.forms.inputs;


export default formsSlice.reducer;