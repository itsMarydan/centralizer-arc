import {Modal} from "react-bootstrap";
import React from "react";
import {ShortTextFormEdit} from "../contentTypeEdit/ShortTextFormEdit";
import {RadioFormEdit} from "../contentTypeEdit/RadioFormEdit";
import {CheckBoxFormEdit} from "../contentTypeEdit/CheckBoxFormEdit";
import {ClipLoader} from "react-spinners";
import {FormProvider, useForm} from "react-hook-form";
import {FieldTypeName} from "../utils/filedTypes";
import contentsApi from "../../api/contentsApi";
import {useAppDispatch} from "../../app/hooks";
import {fetchBuilder} from "../../features/contents/contentsSlice";
import {STATUS} from "../../static/api-request";
import {Alert} from "@mui/material";
import {DATA_TYPE} from "../../static/app-values";
import {formsApi} from "../../api/formsApi";
import {fetchBuilder as formBuilder} from "../../features/forms/formsSlice";
interface Props {
    fieldData: any;
    showEditTextModal: boolean;
    handleCloseEditTextModal: any,
    appSlug: string,
    slug: string,
    userRole: string,
    dataType: number
}

export function EditTextFormModal(props: Props) {
    const methods = useForm();
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const dispatch = useAppDispatch();
    const types = [
        {name: "Short Text", value: "short"},
        {name: "Long Text", value: "long"}
    ];


    async function onSubmit(data: any){
        setLoading(true);
        data.contentType = FieldTypeName.TEXT;
        const result = props.dataType === DATA_TYPE.content ?
            await contentsApi.updateBuilderField(props.appSlug, props.slug, props.userRole, props.fieldData.fieldName, data) :
           props.dataType === DATA_TYPE.form ? await formsApi.updateBuilderField(props.appSlug, props.slug, props.userRole, props.fieldData.fieldName, data):
               {status: 404, message: "Unregistered data type", description: "Invalid data type"};

        function onSuccess() {
            props.dataType === DATA_TYPE.content ? dispatch(fetchBuilder({appSlug: props.appSlug, slug: props.slug, userRole: props.userRole})) :
                props.dataType === DATA_TYPE.form ? dispatch(formBuilder({appSlug: props.appSlug, slug: props.slug, userRole: props.userRole})) :
                    console.log("Invalid data type");
            setLoading(false);
            props.handleCloseEditTextModal();
        }
        function settingMessage(message: string){

            setErrorMessage(message)
            setLoading(false);
            setTimeout(() => setErrorMessage(""), 4000)
        }
        result.status === STATUS.SUCCESS ? onSuccess() : settingMessage(`${result.message}, ${result.description ? result.description : ""}`)

    }
    return (
        <>
            <Modal show={props.showEditTextModal} size={"lg"} onHide={props.handleCloseEditTextModal} centered>
                <Modal.Header closeButton/>
                <Modal.Body>
                    {errorMessage ?
                        <div className="error-message mb-2">
                            <Alert severity="error">{errorMessage}</Alert>
                        </div> :
                        null
                    }
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                             <div className="form">
                        <div className="form">
                            <div className="mb-3">
                                <ShortTextFormEdit id={`fieldName`} name={`Field Name`} defaultValue={props.fieldData.fieldName} />
                            </div>
                            <div className="mb-3">
                                <RadioFormEdit default={props.fieldData.textType} id={"textType"} name={"Text Type"} radioSelections={types} />
                            </div>
                            <div className="mb-3">
                                <CheckBoxFormEdit default={props.fieldData.isUnique} id={"isUnique"} name={"Is Unique"} />
                            </div>

                            <div className="mt-2">
                                <button type="submit" className="btn bg-blue text-white">
                                    <span><ClipLoader color={`#ffffff`} loading={loading} size={15}  /></span>
                                    <span className="mx-1 font-15">{!loading ? "Update" : "Updating"}</span>
                                </button>
                            </div>

                        </div>
                    </div>
                        </form>
                    </FormProvider>
                </Modal.Body>
            </Modal>
        </>
    )
}