import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import {SignupObject} from "../../models/auth";
import authApi from "../../api/authApi";
import {fetchUserList} from "../../features/user/userSlice";
import {useDispatch} from "react-redux";
import setCookie from "../../features/custom-cookies";
import {AUTH_TOKEN} from "../../static/token";
import Cookies from "js-cookie";



interface Props {
    handleClose?: any;
}

export const RegisterForm = () => {

    const {register, formState: {errors}, handleSubmit} = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const onSubmit = handleSubmit(async (data: any) => {
        try{
            const signUpObj: SignupObject = {
                firstName: data.firstName,
                lastName: data.lastName,
                key: data.key,
                email: data.email.toLowerCase(),
                password:data.password,
                role: data.role

            }
            console.log(signUpObj)

            await authApi.signup(signUpObj).then((res) => {
                console.log(res);
                setCookie(AUTH_TOKEN, res.token);
                console.log("User Created");
            })
            dispatch(fetchUserList());
            const checkCookie = () => {
                const cookie = Cookies.get(AUTH_TOKEN);
                if (cookie) {
                    navigate('/');
                } else {
                    setTimeout(checkCookie, 2000);
                }
            };
            checkCookie();

            // navigate('/')

        }catch(error){
            console.error(error)
            setErrorMessage("Error Registering User!")
        }
    })
    return (
        <>
            <form onSubmit={onSubmit}>
                {errorMessage && <div className="error">{errorMessage}</div>}
                <div className="row">
                    <div className="mb-3 col">
                        <label className="form-label" htmlFor="firstName">First Name </label>
                        <input type="text" className="form-control" {...register("firstName", {required: true})}
                               id="firstName"/>
                        {errors.firstName?.type === 'required' && "First name is required"}
                    </div>
                    <div className="mb-3 col">
                        <label className="form-label" htmlFor="lastName">Last Name </label>
                        <input type="text" className="form-control"
                               id="lastName" {...register("lastName", {required: true})} />
                        {errors.lastName && "Last name is required"}
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="role">User Role</label>
                    <input type="text" className="form-control"
                           id="role" {...register("role", {required: true})} />
                    {errors.lastName && "Role is required"}
                </div>
                <div className="mb-3">
                    <label htmlFor="key" className="form-label">User Create Key</label>
                    <input type="key"  {...register("key", {required: true})} className="form-control"
                           id="key"/>
                    <div className="font-12 red">{errors.key && "Key is Required"}</div>
                </div>
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
                    <div className="font-12 red">{errors.password?.message}</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input type="password"  {...register("confirmPassword", {
                        required: true, minLength: {
                            value: 12,
                            message: "Password must have at least 12 characters"
                        }
                    })} className="form-control"
                           id="confirmPassword"/>
                    <div className="font-12 red">{errors.confirmPassword?.message}</div>
                </div>
                <button className="btn w-100 login-button mb-3" type="submit">Create User</button>
            </form>
            <Link to="/login" className="text-center mt-3 roboto">Already have an account? Log In</Link>
        </>
    )
}