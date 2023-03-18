import contentsApi from "../../api/contentsApi";
import {BuilderObject} from "../../models/contents"
import {FieldsDisplay} from "./components/FieldsDisplay";
import React from "react";
import {Alert} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchBuilder, selectEditing, setEditing} from "../../features/contents/contentsSlice";
import {STATUS} from "../../static/api-request";
import {capitalize} from "../../helper/caseChange";
import {EditTextFormModal} from "../editFormModals/EditTextFormModal";
import {FieldTypeName} from "../utils/filedTypes";
import {EditTimeFormModal} from "../editFormModals/EditTimeFormModal";
import {EditRichTextFieldModal} from "../editFormModals/EditRichTextFormModal";
import {EditNumberFormModal} from "../editFormModals/EditNumberFormModal";
import {EditMediaFormModal} from "../editFormModals/EditMediaFormModal";
import {EditJsonFormModal} from "../editFormModals/EditJsonFormModal";
import {EditDateTimeFormModal} from "../editFormModals/EditDateTimeFormModal";
import {EditDateFormModal} from "../editFormModals/EditDateFormModal";
import {EditBooleanFieldFormModal} from "../editFormModals/EditBooleanFormModal";
import {DATA_TYPE} from "../../static/app-values";
import {formsApi} from "../../api/formsApi";
import {fetchBuilder as formBuilder} from "../../features/forms/formsSlice";

interface Props{
    builder: BuilderObject,
    appSlug: string,
    slug: string,
    userRole: string,
    dataType: number
}

export function BuilderFields(props: Props){
    const [errorMessage, setErrorMessage] = React.useState("");
    const [deleteSuccess, setDeleteSuccess] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const dispatch = useAppDispatch();
    const editing = useAppSelector(selectEditing);
    function onSuccess(fieldName: string) {
        setLoading(false);
        settingSuccessMessage(`Field ${capitalize(fieldName)} was deleted successfully!`)
        props.dataType === DATA_TYPE.content ? dispatch(fetchBuilder({appSlug: props.appSlug, slug: props.slug, userRole: props.userRole})) :
            props.dataType === DATA_TYPE.form ? dispatch(formBuilder({appSlug: props.appSlug, slug: props.slug, userRole: props.userRole})) :
                console.log("Invalid data type");
    }
    function settingErrorMessage(message: string){
        setErrorMessage(message)
        setTimeout(() => setErrorMessage(""), 4000)
    }
    function settingSuccessMessage(message: string){

        setDeleteSuccess(message)
        setTimeout(() => setDeleteSuccess(""), 4000)
    }
    async function onDelete(fieldName: string){
        setLoading(true);
       const result = props.dataType === DATA_TYPE.content ?
           await contentsApi.deleteBuilderField(props.appSlug, props.slug, props.userRole, fieldName) :
           props.dataType === DATA_TYPE.form ? await formsApi.deleteBuilderField(props.appSlug, props.slug, props.userRole, fieldName) :
            {status: 404, message: "Unregistered data type", description: "Invalid data type"};

        while(!Boolean(result)){
            setLoading(true)
        }
        result.status === STATUS.SUCCESS ? onSuccess(fieldName) : settingErrorMessage(`${result.message} ${result.description ? `, ${result.description}` : ""}`)
    }
    function onEdit(field: any) {
        // setEditField(field);
        dispatch(setEditing(field));
        selectEditor(field.contentType.name)
    }

    function selectEditor(contentType: any){
        if(contentType === FieldTypeName.TEXT.name){
            setShowEditTextModal(true);
        }

        if(contentType === FieldTypeName.TIME.name){
            setShowEditTimeModal(true);
        }
        if (contentType === FieldTypeName.RICH_TEXT.name){
            setShowEditRichTextModal(true);
        }

        if (contentType === FieldTypeName.NUMBER.name){
            setShowEditNumberModal(true);
        }
        if (contentType === FieldTypeName.MEDIA.name){
            setShowEditMediaModal(true);
        }
        if (contentType === FieldTypeName.JSON_CONTENT.name){
            setShowEditJsonModal(true);
        }
        if (contentType === FieldTypeName.DATE_TIME.name){
            setShowDateTimeModal(true);
        }

        if (contentType === FieldTypeName.DATE.name){
            setShowDateModal(true);
        }

        if (contentType === FieldTypeName.BOOLEAN.name){
            setShowBooleanModal(true);
        }
    }

    const [showEditTextModal, setShowEditTextModal] = React.useState(false);
    const [showEditTimeModal, setShowEditTimeModal] = React.useState(false);
    const [showEditRichTextModal, setShowEditRichTextModal] = React.useState(false);
    const [showEditNumberModal, setShowEditNumberModal] = React.useState(false);
    const [showEditMediaModal, setShowEditMediaModal] = React.useState(false);
    const [showEditJsonModal, setShowEditJsonModal] = React.useState(false);
    const [showEditDateTimeModal, setShowDateTimeModal] = React.useState(false);
    const [showEditDateModal, setShowDateModal] = React.useState(false);
    const [showEditBooleanModal, setShowBooleanModal] = React.useState(false);
    const handleCloseEditTextModal = () => setShowEditTextModal(false);
    const handleCloseEditTimeModal = () => setShowEditTimeModal(false);
    const handleCloseEditRichTextModal = () => setShowEditRichTextModal(false);
    const handleCloseEditNumberModal = () => setShowEditNumberModal(false);
    const handleCloseEditMediaModal = () => setShowEditMediaModal(false);
    const handleCloseEditJsonModal = () => setShowEditJsonModal(false);
    const handleCloseEditDateTimeModal = () => setShowDateTimeModal(false);
    const handleCloseEditDateModal = () => setShowDateModal(false);
    const handleCloseEditBooleanModal = () => setShowBooleanModal(false);
    return(
        <>
            {errorMessage ? <div className="error-message">
                    <Alert severity="error">{errorMessage}</Alert>
                </div> : null}
            {deleteSuccess ? <div className="success-message mb-2">
                    <Alert severity="success">{deleteSuccess}</Alert>
                </div> : null}
            {props.builder ?
            <FieldsDisplay loading={loading} builder={props.builder} onDelete={onDelete} onEdit={onEdit} /> :null
            }
            <EditTextFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole}  showEditTextModal={showEditTextModal} handleCloseEditTextModal={handleCloseEditTextModal} fieldData={editing}  dataType={props.dataType}/>
            <EditTimeFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole}  showEditTimeFormModal={showEditTimeModal} handleCloseEditTimeFormModal={handleCloseEditTimeModal} fieldData={editing}  dataType={props.dataType}/>
            <EditRichTextFieldModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole} showEditRichTextForm={showEditRichTextModal} handleCloseEditRichTextForm={handleCloseEditRichTextModal} fieldData={editing}  dataType={props.dataType}/>
            <EditNumberFormModal   appSlug={props.appSlug} slug={props.slug} userRole={props.userRole} showEditNumberModal={showEditNumberModal} handleCloseEditNumberModal={handleCloseEditNumberModal}  fieldData={editing} dataType={props.dataType}/>
            <EditMediaFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole} showEditMediaFormModal={showEditMediaModal} handleCloseEditMediaFormModal={handleCloseEditMediaModal} fieldData={editing}  dataType={props.dataType}/>
            <EditJsonFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole} showEditJsonForm={showEditJsonModal} handleCloseEditJsonForm={handleCloseEditJsonModal} fieldData={editing}  dataType={props.dataType}/>
            <EditDateTimeFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole} showEditDateTimeFormModal={showEditDateTimeModal} handleCloseEditDateTimeFormModal={handleCloseEditDateTimeModal} fieldData={editing}  dataType={props.dataType}/>
            <EditDateFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole} showEditDateModalForm={showEditDateModal} handleCloseEditDateModalForm={handleCloseEditDateModal} fieldData={editing}  dataType={props.dataType}/>
            <EditBooleanFieldFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole} showEditBooleanForm={showEditBooleanModal} handleCloseEditBooleanForm={handleCloseEditBooleanModal} fieldData={editing}  dataType={props.dataType}/>
        </>
    )
}