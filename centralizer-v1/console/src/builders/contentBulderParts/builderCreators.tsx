import {ContentTypeTextFormModal} from "../createFormModals/ContentTypeTextFormModal";
import {FieldType} from "../utils/filedTypes";
import React from 'react';
import {SelectFieldTypeModal} from "../modals/SelectFieldTypeModal";
import {RichTextFiledFormModal} from "../createFormModals/ContentTypeRichTextFormModal";
import {NumberFormModal} from "../createFormModals/ContentTypeNumberFormModal";
import {DateFormModal} from "../createFormModals/ContentDateFormModal";
import {ContentTypeTimeFormModal} from "../createFormModals/ContentTypeTimeFormModal";
import {ContentDateTimeFormModal} from "../createFormModals/ContentDateTimeFormModal";
import {ContentTypeJsonFormModal} from "../createFormModals/ContentTypeJsonFormModal";
import {ContentTypeMediaFormModal} from "../createFormModals/ContentTypeFormMedia";
import {BooleanFiledFormModal} from "../createFormModals/ContentTypeBooleanFormModal";
interface  Props{
    selectedFiledType: string,
    showFieldSelector: boolean,
    setShowFieldSelector: any,
    setFieldType: any,
    appSlug: string,
    slug: string,
    userRole: string,
    dataType: number
}
export function BuilderCreators(props: Props) {
    const [showTextModal, setShowTextModal] = React.useState(false);
    const [showRichTextModal, setShowRichTextModal] = React.useState(false);
    const [showNumberModal, setShowNumberModal] = React.useState(false);
    const [showDateModal, setShowDateModal] = React.useState(false);
    const [showTimeModal, setShowTimeModal] = React.useState(false);
    const [showDateTimeModal, setShowDateTimeModal] = React.useState(false);
    const [showJsonFormModal, setShowJsonFormModal] = React.useState(false);
    const [showMediaFormModal, setShowMediaFormModal] = React.useState(false);
    const [showBooleanFormModal, setShowBooleanFormModal] = React.useState(false);
    const handleCloseTextFormModal = () => setShowTextModal(false)
    const handleCloseFieldSelector = () => props.setShowFieldSelector(false);
    const handleCloseRichTextFormModal = () =>  setShowRichTextModal(false);
    const handleCloseNumberModalForm = () => setShowNumberModal(false);
    const handleCloseDateFormModal = () => setShowDateModal(false);
    const handleCloseTimeFormModal = () => setShowTimeModal(false);
    const handleCloseDateTimeFormModal = () => setShowDateTimeModal(false);
    const handleCloseJsonFormModal = () => setShowJsonFormModal(false);
    const handleCloseMediaFormModal = () => setShowMediaFormModal(false);
    const handleCloseBooleanFormModal = () => setShowBooleanFormModal(false);
    function selectFieldType(fieldType: any){
        props.setFieldType(fieldType)
        if (fieldType === FieldType.TEXT) {
            setShowTextModal(true);
            handleCloseFieldSelector()
        }
        if (fieldType === FieldType.RICH_TEXT) {
            setShowRichTextModal(true);
            handleCloseFieldSelector()
        }
        if (fieldType === FieldType.NUMBER) {
            setShowNumberModal(true);
            handleCloseFieldSelector();
        }
        if (fieldType === FieldType.DATE) {
            setShowDateModal(true);
            handleCloseFieldSelector()
        }
        if (fieldType === FieldType.TIME) {
            setShowTimeModal(true);
            handleCloseFieldSelector();
        }
        if (fieldType === FieldType.DATE_TIME) {
            setShowDateTimeModal(true);
            handleCloseFieldSelector();
        }
        if (fieldType === FieldType.JSON_CONTENT) {
            setShowJsonFormModal(true);
            handleCloseFieldSelector();
        }
        if (fieldType === FieldType.MEDIA) {
            setShowMediaFormModal(true);
            handleCloseFieldSelector();
        }
        if (fieldType === FieldType.BOOLEAN) {
            setShowBooleanFormModal(true);
            handleCloseFieldSelector();
        }
    }

    return(
        <>
            <SelectFieldTypeModal  show={props.showFieldSelector} handleClose={handleCloseFieldSelector} selectFiledType={selectFieldType} />
            <ContentTypeTextFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole} showTextModal={showTextModal} handleCloseTextFormModal={handleCloseTextFormModal}  dataType={props.dataType}/>
            <RichTextFiledFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole}  showRichTextModal={showRichTextModal} handleCloseRichTextFormModal={handleCloseRichTextFormModal}  dataType={props.dataType}/>
            <NumberFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole}  showNumberModal={showNumberModal} handleCloseNumberModalForm={handleCloseNumberModalForm}  dataType={props.dataType}/>
            <DateFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole}  showDateModal={showDateModal} handleCloseDateFormModal={handleCloseDateFormModal}  dataType={props.dataType}/>
            <ContentTypeTimeFormModal  appSlug={props.appSlug} slug={props.slug} userRole={props.userRole}  showTimeModal={showTimeModal} handleCloseTimeFormModal={handleCloseTimeFormModal}  dataType={props.dataType}/>
            <ContentDateTimeFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole}  showDateTimeModal={showDateTimeModal} handleCloseDateTimeFormModal={handleCloseDateTimeFormModal}  dataType={props.dataType}/>
            <ContentTypeJsonFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole}  showJsonFormModal={showJsonFormModal} handleCloseJsonFormModal={handleCloseJsonFormModal}  dataType={props.dataType}/>
            <ContentTypeMediaFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole} showMediaFormModal={showMediaFormModal} handleCloseMediaFormModal={handleCloseMediaFormModal}  dataType={props.dataType}/>
            <BooleanFiledFormModal appSlug={props.appSlug} slug={props.slug} userRole={props.userRole}  showBooleanFormModal={showBooleanFormModal} handleCloseBooleanFormModal={handleCloseBooleanFormModal}  dataType={props.dataType}/>
        </>
    )
}