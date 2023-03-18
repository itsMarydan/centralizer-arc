import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import {LoginObject} from '../../models/auth';
import {useSelector} from "react-redux";
import {selectIsLoggedIn} from "../../features/auth/authSlice";
import Cookies from "js-cookie";
import {AUTH_TOKEN} from "../../static/token";
import {ClipLoader} from "react-spinners";


export const LoginForm = (props: any) => {
   const {processDispatch} = props;
    const {register, formState: {errors}, handleSubmit} = useForm();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const isLogin = useSelector(selectIsLoggedIn);
    const onSubmit = handleSubmit(async (data: any) => {
        setLoading(true);
        try{
            const loginObject: LoginObject = {
                email: data.email.toLowerCase(),
                password:data.password
            }
           await processDispatch(loginObject);
            const checkCookie = () => {
                const cookie = Cookies.get(AUTH_TOKEN);
                if (cookie) {
                    navigate('/');
                } else {
                    setTimeout(checkCookie, 2000);
                }
            };
            checkCookie();
            setLoading(false)
        }catch(error){
            console.error(error)
            setLoading(false)
            setErrorMessage("Incorrect Credentials!")
        }

     })
    return (
        <>
            <form onSubmit={onSubmit}>
                {errorMessage && <div className="error">{errorMessage}</div>}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email"  {...register("email", {required: true})} className="form-control" id="email"
                           placeholder="example@example.com"/>
                    {errors.email && "Email is required"}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password"  {...register("password", {required: true})} className="form-control"
                           id="password"/>
                    {errors.password && "Password is required"}
                </div>
                <button className="btn w-100 login-button text-white" type="submit">
                    <span><ClipLoader color={`#ffffff`} loading={loading} size={15}  /></span>
                    <span className="mx-1 font-15">{!loading ? "Log In" : "Logging In"}</span></button>
            </form>
            <Link to="/forgot-password" className="text-center mt-3 roboto">Forgot Password?</Link>
            <Link to="/signup" className="text-center mt-3 roboto">Create Account</Link>

        </>
    )
}