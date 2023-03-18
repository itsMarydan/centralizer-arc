import {Modal} from "react-bootstrap";
import {FormProvider, useForm} from "react-hook-form";
import {ShortTextForm} from "../contentType/ShortTextForm";
import React from "react";
import {useAppDispatch} from "../../app/hooks";
import {FieldTypeName} from "../utils/filedTypes";
import contentsApi from "../../api/contentsApi";
import {fetchBuilder} from "../../features/contents/contentsSlice";
import {STATUS} from "../../static/api-request";
import {Alert} from "@mui/material";
import {ClipLoader} from "react-spinners";
import {DATA_TYPE} from "../../static/app-values";
import {formsApi} from "../../api/formsApi";
import {fetchBuilder as formBuilder} from "../../features/forms/formsSlice";

interface MediaFormProps{
    showMediaFormModal: boolean,
    handleCloseMediaFormModal: any,
    appSlug: string,
    slug: string,
    userRole: string,
    dataType: number,

}
export function ContentTypeMediaFormModal(props: MediaFormProps){
    const methods = useForm();
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const dispatch = useAppDispatch();
    async function onSubmit(data: any){
        setLoading(true)
        data.contentType = FieldTypeName.MEDIA;
        const result = props.dataType === DATA_TYPE.content  ? await contentsApi.addBuilderField(props.appSlug, props.slug, props.userRole, data) :
            props.dataType === DATA_TYPE.form ? await formsApi.addBuilderField(props.appSlug, props.slug, props.userRole, data) :
                {status: 404, message: "Unregistered data type", description: "Invalid data type"}
        function onSuccess() {
            props.dataType === DATA_TYPE.content ? dispatch(fetchBuilder({appSlug: props.appSlug, slug: props.slug, userRole: props.userRole})) :
                props.dataType === DATA_TYPE.form ? dispatch(formBuilder({appSlug: props.appSlug, slug: props.slug, userRole: props.userRole})) :
                    console.log("Invalid data type");
            setLoading(false);
            props.handleCloseMediaFormModal();
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
            <Modal show={props.showMediaFormModal} onHide={props.handleCloseMediaFormModal} size={"lg"} centered>
                <Modal.Header  closeButton>Media Field</Modal.Header>
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
                                <div className="mb-3">
                                    <ShortTextForm id={"fieldName"} name={"Field Name"} />
                                </div>
                                <div className="mt-2">
                                    <button type="submit" className="btn bg-blue text-white">
                                        <span><ClipLoader color={`#ffffff`} loading={loading} size={15}  /></span>
                                        <span className="mx-1 font-15">{!loading ? "Add" : "Adding"}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </Modal.Body>
            </Modal>
        </>
    )
}