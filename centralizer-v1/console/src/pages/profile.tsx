import Layout from "../layout";
import {UpdateUserForm} from "../componenets/forms/updateUser";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {logout, selectCurrentUser} from "../features/auth/authSlice";
import {LogOut} from "../componenets/forms/logOut";
import {getCookie} from "typescript-cookie";
import {AUTH_TOKEN} from "../static/token";
import React from "react";
import {PasswordRest} from "../componenets/forms/passwordRest";

export function Profile() {
    const currentUser = useAppSelector(selectCurrentUser);
    const token = getCookie(AUTH_TOKEN)

    const [resetPassword, setResetPassword] = React.useState(false);
     const handleClosePasswordReset = () => setResetPassword(false);
    return (
        <>
            <Layout>
                <h1>Profile</h1>
                <UpdateUserForm user={currentUser} />
                <div className="mt-4" />


                {!resetPassword ?
                    <button onClick={() => setResetPassword(true)} className="btn btn-outline-primary">Rest Password</button>
                    : null
                }
                {resetPassword ?
                    <PasswordRest handleClosePasswordReset={handleClosePasswordReset} />
                    : null
                }

            </Layout>
        </>
    );
}