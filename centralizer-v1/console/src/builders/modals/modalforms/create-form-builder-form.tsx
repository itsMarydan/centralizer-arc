import {FormProvider, useForm} from "react-hook-form";
import React from "react";
import {useNavigate} from "react-router";
import {Alert} from "@mui/material";
import {ShortTextForm} from "../../contentType/ShortTextForm";
import {CheckBoxForm} from "../../contentType/CheckBoxForm";
import {ClipLoader} from "react-spinners";
import contentsApi from "../../../api/contentsApi";
import {STATUS} from "../../../static/api-request";
import {kebab} from "../../../helper/caseChange";
import {formsApi} from "../../../api/formsApi";

interface Props{
    appSlug: string,
}
export function  CreateFormBuilderForm(props: Props){

    const methods = useForm();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const navigate = useNavigate();
    const onSubmit = async( data: any )=> {
        setLoading(true)
        const payload = {
            formName: data.formName,
            fields: [],
            isDynamic: data.isDynamic
        }
        const  result = await  formsApi.createBuilder(props.appSlug, payload)
        while(!Boolean(result)){
            setLoading(true)
        }
        function settingMessage(message: string){

            setError(message)
            setLoading(false);
            setTimeout(() => setError(""), 4000)
        }
        function onSuccess(formSlug: string) {
            setLoading(false);
            navigate(`/app/${props.appSlug}/build-form/${formSlug}`)
        }
        result.status === STATUS.SUCCESS ? onSuccess(kebab(data.formName)) : settingMessage(result.message)

    }

    return (
        <>
            <FormProvider {...methods}>
                <div className="form">
                    {error ?
                        <div className="error-message">
                            <Alert severity="error">{error}</Alert>
                        </div> :
                        null
                    }
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <ShortTextForm id={`formName`} name={`Form Name`} options={{required: true, min: 3}} />
                        <CheckBoxForm id={`isDynamic`} name={`Make it Dynamic`}  />
                        <button type="submit"
                                className="btn btn-sm mt-3 text-white bg-blue ">
                            <span><ClipLoader color={`#ffffff`} loading={loading} size={15}  /></span>
                            <span className="mx-1 font-15">{!loading ? "Create" : "Creating"}</span>
                        </button>
                    </form>
                </div>
            </FormProvider>
        </>
    )
}