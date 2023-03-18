import {FormProvider, useForm} from "react-hook-form";
import {ShortTextForm} from "../../contentType/ShortTextForm";
import {ClipLoader} from "react-spinners";
import React from 'react';
import {CheckBoxForm} from "../../contentType/CheckBoxForm";
import contentsApi from "../../../api/contentsApi";
import {STATUS} from "../../../static/api-request";
import {useNavigate} from "react-router-dom";
import {Alert} from "@mui/material";
import {kebab} from "../../../helper/caseChange";


interface Props{
    appSlug: string,
}
export function ContentBuilderCreateForm (props: Props){
    const methods = useForm();
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    const navigate = useNavigate();
    const onSubmit = async( data: any )=> {
        setLoading(true)
        const payload = {
            contentName: data.contentName,
            fields: [],
            isDynamic: data.isDynamic
        }
        const  result = await  contentsApi.createBuilder(props.appSlug, payload)
        while(!Boolean(result)){
            setLoading(true)
        }
       function settingMessage(message: string){

           setErrorMessage(message)
            setLoading(false);
           setTimeout(() => setErrorMessage(""), 4000)
        }
        function onSuccess(contentSlug: string) {
            setLoading(false);
             navigate(`/app/${props.appSlug}/build-content/${contentSlug}`)
        }
        result.status === STATUS.SUCCESS ? onSuccess(kebab(data.contentName)) : settingMessage(result.message)

    }
    return (
        <FormProvider {...methods}>
            <div className="form">
                {errorMessage ?
                    <div className="error-message">
                        <Alert severity="error">{errorMessage}</Alert>
                    </div> :
                    null
                }

                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <ShortTextForm id={`contentName`} name={`Content Name`} options={{required: true, min: 3}}/>
                    <CheckBoxForm id={`isDynamic`} name={`Make it Dynamic`}  />
                    <button type="submit"
                            className="btn btn-sm mt-3 text-white bg-blue ">
                        <span><ClipLoader color={`#ffffff`} loading={loading} size={15}  /></span>
                        <span className="mx-1 font-15">{!loading ? "Create" : "Creating"}</span>
                    </button>
                </form>
            </div>
        </FormProvider>
    )
}