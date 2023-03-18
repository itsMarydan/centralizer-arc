import {ShortTextForm} from "../../builders/contentType/ShortTextForm";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import {APP_STATUS} from "../../static/app-values";
import {useAppSelector} from "../../app/hooks";
import {selectCurrentUser} from "../../features/auth/authSlice";
import appsApi from "../../api/appsApi";

interface Interface{
    handleCloseCreateApp: any
}
const CreateAppForm = (props: Interface) => {
    const methods = useForm();
    const currentUser = useAppSelector(selectCurrentUser)
    const onSubmit =( data: any )=> {
        const status = APP_STATUS.ACTIVE.value;
        const createdBy = currentUser?.userId ? currentUser.userId :  0;
        console.log(data, status, createdBy);
        appsApi.createApp(data.appName, createdBy,status)
        props.handleCloseCreateApp();
    }
    function onChange(e: any, id: string){
        console.log(id)
    }
    return (
        <FormProvider {...methods}>
            <div className="form">
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <ShortTextForm id={`appName`} name={`Application Name`} options={{required: true, min: 3}}
                                   onChange={(e: any) => (onChange(e, "appName"))}/>
                    <button type="submit"
                            className="btn btn-sm mt-3 text-white bg-blue ">Create</button>
                </form>
            </div>
        </FormProvider>
    )
}

export  default  CreateAppForm;