import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {SignupObject} from "../../models/auth";
import authApi from "../../api/authApi";
import {selectCurrentUser} from "../../features/auth/authSlice";
import {useAppSelector} from "../../app/hooks";

export function PasswordRest(props: any){

    const currentUser = useAppSelector(selectCurrentUser);

    const {register, watch, formState: {errors}, handleSubmit} = useForm();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const onSubmit = handleSubmit(async (data: any) => {
        try{
            console.log(data)
            const email = currentUser? currentUser.email ? currentUser.email : "" : "";
            if(email === "") {
                setErrorMessage("Email is required!")
                return;
            }
            const response = await authApi.passwordResetAsAdmin( email ,data.password);
            props.handleClosePasswordReset();
        }catch(error){
            console.error(error)
            setErrorMessage("Password Reset Failed!")
        }
    })

    return (
        <>
            <form onSubmit={onSubmit}>
                {errorMessage && <div className="error">{errorMessage}</div>}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password"  {...register("password", {required: true, minLength: {
                            value: 8,
                            message: "Password must have at least 12 characters"
                        }})} className="form-control"
                           id="password"/>
                    <div className="font-12 red">{errors.password?.message}</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input type="password"  {...register("confirmPassword", {
                        required: true, minLength: {
                            value: 8,
                            message: "Password must have at least 12 characters"
                        },
                        validate: value => value === watch("password") || "Passwords do not match"
                    })} className="form-control"
                           id="confirmPassword"/>
                    <div className="font-12 red">{errors.confirmPassword?.message}</div>
                </div>
                <button className="btn login-button mb-3" type="submit">Reset Password</button>
            </form>
        </>
    )
}