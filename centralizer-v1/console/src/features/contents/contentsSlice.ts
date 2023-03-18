import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SchemaObject, ContentSingle} from "../../models/contents";

import {RootState} from './../../app/store';

export interface ContentsState {
    loading?: boolean;
    list: ContentSingle[];
    builderLoading: boolean;
    builder: any;
    editing: any;
    identifiers: any;
    schema: any;
    schemaLoading: boolean;
    contents: any;
    contentsLoading: boolean;
    fileGallery: any;
    content: any;
}

const initialState: ContentsState = {
    loading: false,
    list: [],
    builderLoading: false,
    builder: {},
    editing: {},
    identifiers: {},
    schema:{},
    schemaLoading: false,
    contents: [],
    contentsLoading: false,
    fileGallery: [],
    content: {}
}

const contentsSlice = createSlice({
    name: 'contents',
    initialState,
    reducers: {
        fetchContentList: (state, action:PayloadAction<string> ) => {
            state.loading = true;
        },
        fetchContentListSuccess: (state, action: PayloadAction<ContentSingle[]>) =>{
            state.list = action.payload;
            state.loading = false;
        },
        fetchContentListFailed(state, action: PayloadAction<string>){
            state.loading = false;
        },
        fetchBuilder: (state, action:PayloadAction<any> ) => {
            state.builderLoading = true;
        },
        fetchBuilderSuccess: (state, action: PayloadAction<ContentSingle[]>) =>{
            state.builder = action.payload;
            state.builderLoading = false;
        },
        fetchBuilderFailed(state, action: PayloadAction<string>){
            state.builderLoading = false;
        },
        setEditing: (state, action:PayloadAction<any>) => {
           state.editing = action.payload;
        },
        setIdentifiers: (state, action:PayloadAction<any>) => {
            state.identifiers = action.payload;
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
        fetchContents:(state, action: PayloadAction<any>)=>{
            state.contentsLoading = true;
        },
        fetchContentsSuccess:(state, action: PayloadAction<any>)=>{
            state.contents= action.payload;
            state.contentsLoading = false;

        },
        fetchContentsFailed: (state, action: PayloadAction<string>)=>{
            state.contentsLoading = false;
        },
        setFileGallery: (state, action: PayloadAction<any>) =>{
            state.fileGallery = action.payload;
        },
        setContent:(state, action: PayloadAction<any>) => {
            state.content = action.payload;
        },
    },
});


export const {fetchContentList, fetchContentListSuccess, fetchContentListFailed, fetchBuilder
    ,fetchBuilderSuccess, fetchBuilderFailed, setEditing, setIdentifiers, fetchSchema,
    fetchSchemaSuccess, setContent, fetchSchemaFailed, fetchContents, fetchContentsSuccess, fetchContentsFailed, setFileGallery} = contentsSlice.actions;

// Selectors
export const selectContentsLoading = (state: RootState) => state.contents.loading;
export const selectContentList = (state: RootState) => state.contents.list;
export const selectContentBuilder = (state: RootState) => state.contents.builder;
export const selectEditing = (state: RootState) => state.contents.editing;
export const selectIdentifiers = (state: RootState) => state.contents.identifiers;
export const selectContentSchema = (state: RootState) => state.contents.schema;
export const selectContents = (state: RootState) => state.contents.contents;
export  const selectFileGallery = (state: RootState) => state.contents.fileGallery;
export const selectContent = (state: RootState) => state.contents.content;

// Reducer
export default  contentsSlice.reducer;;