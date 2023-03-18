import {Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {ShortTextFormEdit} from "../contentTypeEdit/ShortTextFormEdit";
import {ClipLoader} from "react-spinners";
import {ShowDiv, StepperItem} from "../StyledComponents";
import {ShortTextForm} from "../contentType/ShortTextForm";
import {CheckBoxForm} from "../contentType/CheckBoxForm";
import {NumberForm} from "../contentType/NumberForm";
import {CheckBoxFormEdit} from "../contentTypeEdit/CheckBoxFormEdit";
import {NumberFormEdit} from "../contentTypeEdit/NumberFormEdit";
import {useAppDispatch} from "../../app/hooks";
import {FieldTypeName} from "../utils/filedTypes";
import contentsApi from "../../api/contentsApi";
import {fetchBuilder} from "../../features/contents/contentsSlice";
import {STATUS} from "../../static/api-request";
import {Alert} from "@mui/material";
import {DATA_TYPE} from "../../static/app-values";
import {formsApi} from "../../api/formsApi";
import {fetchBuilder as formBuilder} from "../../features/forms/formsSlice";

interface EditNumberFormModalProps{
    fieldData: any,
    showEditNumberModal: boolean,
    handleCloseEditNumberModal: any,
    appSlug: string,
    slug: string,
    userRole: string,
    dataType: number
}
export function EditNumberFormModal(props: EditNumberFormModalProps){

    const methods = useForm();
    const [loading, setLoading] = React.useState(false);
    const [stepperId, setStepperId] = useState(0);
    const [fieldNameValue, setFieldNameValue] = useState('');
    const [checkBoxValue, setCheckBoxValue] = useState(false);
    const [autoGenerateValue, setAutoGenerateValue] = useState(false);
    const [reset, setReset] = useState(false);
    const [initialValueValue, setInitialValueValue] = useState(0);
    const [incrementByValue, setIncrementByValue] = useState(0);
    const [errorMessage, setErrorMessage] = React.useState("");
    const dispatch = useAppDispatch();
    async function onSubmit(data: any){
        data.contentType = FieldTypeName.NUMBER;
        const result = props.dataType === DATA_TYPE.content ?
            await contentsApi.updateBuilderField(props.appSlug, props.slug, props.userRole, props.fieldData.fieldName, data) :
            props.dataType === DATA_TYPE.form ? await formsApi.updateBuilderField(props.appSlug, props.slug, props.userRole, props.fieldData.fieldName, data):
                {status: 404, message: "Unregistered data type", description: "Invalid data type"};
        function onSuccess() {
            props.dataType === DATA_TYPE.content ? dispatch(fetchBuilder({appSlug: props.appSlug, slug: props.slug, userRole: props.userRole})) :
                props.dataType === DATA_TYPE.form ? dispatch(formBuilder({appSlug: props.appSlug, slug: props.slug, userRole: props.userRole})) :
                    console.log("Invalid data type");
            setLoading(false);
            props.handleCloseEditNumberModal();
        }
        function settingMessage(message: string){

            setErrorMessage(message)
            setLoading(false);
            setTimeout(() => setErrorMessage(""), 4000)
        }
        result.status === STATUS.SUCCESS ? onSuccess() : settingMessage(`${result.message}, ${result.description ? result.description : ""}`)
    }

    return(
        <>
            <Modal show={props.showEditNumberModal} onHide={props.handleCloseEditNumberModal} size={"lg"}centered>
                <Modal.Header  closeButton/>
                <Modal.Body>
                    {errorMessage ?
                        <div className="error-message mb-2">
                            <Alert severity="error">{errorMessage}</Alert>
                        </div> :
                        null
                    }
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                            <StepperItem showStep={stepperId == 0}>
                                <div className="form">
                                    <div className="mb-3">
                                        <ShortTextFormEdit defaultValue={props.fieldData.fieldName}  id={"fieldName"} onChange={(e: any) =>  setFieldNameValue(e.target.value)} name={"Field Name"} />
                                    </div>
                                    <div className="mt-2">Is This field unique? or an identifier?</div>
                                    <div className="form-check">
                                        <CheckBoxFormEdit default={props.fieldData.isUnique}  name={"Is Unique or Identity"} onChange={(e: any) => setCheckBoxValue(!checkBoxValue)} id={"isUnique"} />
                                    </div>
                                    <div className="form-check">
                                        <CheckBoxFormEdit default={props.fieldData.autoGenerate} name={"Auto Generate"} onChange={(e: any) => {
                                            setReset(true)
                                            setAutoGenerateValue(!autoGenerateValue)
                                        }} id={"autoGenerate"} />
                                    </div>

                                    <div className="mt-2">
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                           if(reset){
                                               autoGenerateValue  ? setStepperId(1) : setStepperId (2)
                                           }else{
                                               props.fieldData.autoGenerate ? setStepperId(1) : setStepperId (2)
                                            }

                                        }} className="btn bg-blue text-white">Next
                                        </button>
                                    </div>
                                </div>
                            </StepperItem>
                            <StepperItem  showStep={stepperId == 1}>
                                <div className="form">
                                    <div className="mb-3">
                                        <NumberFormEdit defaultValue={props.fieldData.initialValue} id={"initialValue"}  name={"Initial Value"}
                                                    onChange={(e: any) => setInitialValueValue(parseInt(e.target.value))}/>
                                    </div>
                                    <div className="mb-3">
                                        <NumberFormEdit defaultValue={props.fieldData.increaseBy} id={"increaseBy"}  name={"Increase By"}
                                                    onChange={(e: any) => setIncrementByValue(parseInt(e.target.value))}/>
                                    </div>
                                    <div className="review-submit">
                                        <button onClick={(e: any) => {
                                            e.preventDefault();
                                            setStepperId(2)
                                        }} className="btn text-white bg-danger mr-2">
                                            Review
                                        </button>

                                        <button type="submit" className="btn text-white bg-success mx-3">
                                            <span><ClipLoader color={`#ffffff`} loading={loading} size={15}  /></span>
                                            <span className="mx-1 font-15">{!loading ? "Update" : "Updating"}</span>
                                        </button>

                                        <button onClick={(e: any) => {
                                            e.preventDefault();
                                            setStepperId(0)
                                        }} className="btn text-white bg-blue">Back</button>
                                    </div>
                                </div>
                            </StepperItem>
                            <StepperItem showStep={stepperId == 2}>
                                <div className="mx-2">
                                    <div className="my-2  border-bottom">Review Your Entry</div>
                                    <div className="item">Field Name: {fieldNameValue} </div>
                                    <div className="item">Is Unique Or Identity: {checkBoxValue ? 'Yes' : 'No'} </div>
                                    <ShowDiv show={autoGenerateValue}>
                                        <div className="item">Auto Generate: {autoGenerateValue ? 'Yes' : 'No'}</div>
                                        <div className="item">Initial Value:  {initialValueValue}</div>
                                        <div className="item">Increase By: {incrementByValue}</div>
                                    </ShowDiv>
                                    <div className="mt-2">
                                        <button type="submit" className="btn text-white bg-success">
                                            <span><ClipLoader color={`#ffffff`} loading={loading} size={15}  /></span>
                                            <span className="mx-1 font-15">{!loading ? "Add" : "Adding"}</span>
                                        </button>
                                        <button onClick={(e: any) => {
                                            e.preventDefault();
                                            autoGenerateValue ? setStepperId(1) : setStepperId(0)
                                        }} className="btn mx-2 text-white bg-blue">
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </StepperItem>
                        </form>
                    </FormProvider>
                </Modal.Body>
            </Modal>
        </>
    )
}