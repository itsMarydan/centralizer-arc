import {Alert} from "@mui/material";
import {FormProvider, useForm} from "react-hook-form";
import {ShortTextFormEdit} from "../../builders/contentTypeEdit/ShortTextFormEdit";
import {ClipLoader} from "react-spinners";
import React from "react";
import {User} from "../../models/user";
import userApi from "../../api/userApi";
import {useAppSelector} from "../../app/hooks";
import {selectCurrentUser, updateUserInfo} from "../../features/auth/authSlice";
import {useDispatch} from "react-redux";
import {AUTH_TOKEN} from "../../static/token";
import setCookie from "../../features/custom-cookies";


export function UpdateUserForm(props: any) {
    const methods = useForm();
    const [loading, setLoading] = React.useState(false);
    const [disableEdit, setDisableEdit] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState("");

    const currentUser = useAppSelector(selectCurrentUser)
    const dispatch = useDispatch();

    const user: Partial<User> = props.user;
    async function onSubmit(data: any){
        console.log(data, "Data form update User Form");

        const new_token = await userApi.update( currentUser ? currentUser.userId : "", data);
        console.log(new_token, "New token");
        setCookie(AUTH_TOKEN, new_token.token);
        dispatch(updateUserInfo(new_token.token));
        setErrorMessage("Update successfully");

    }
    return (
        <>
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
                            <ShortTextFormEdit onChange={() => setDisableEdit(false)} id={`firstName`} name={`First Name`} defaultValue={user.firstName ? user.firstName : ""} />
                        </div>
                        <div className="mb-3">
                            <ShortTextFormEdit onChange={() => setDisableEdit(false)} id={`lastName`} name={`Last Name`} defaultValue={user.lastName ? user.lastName : ""} />
                        </div>
                        <div className="mb-3">
                            <ShortTextFormEdit onChange={() => setDisableEdit(false)} id={`email`} name={`Email`} defaultValue={user.email ? user.email : ""} />
                        </div>
                        <div className="mt-3">
                            <button disabled={disableEdit} type="submit" className="btn bg-blue text-white">
                                <span><ClipLoader color={`#ffffff`} loading={loading} size={15}  /></span>
                                <span className="mx-1 font-15">{!loading ? "Update" : "Updating"}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}