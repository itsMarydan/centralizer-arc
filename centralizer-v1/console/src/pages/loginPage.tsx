import {useAppDispatch} from "../app/hooks";
import {LoginForm} from "../componenets/forms/loginForm"
import {login, logout} from "../features/auth/authSlice";
import {LoginObject} from "../models/auth";
import {LogOut} from '../componenets/forms/logOut'
import Logo from '../assets/images/logo.png';
export const Login = () => {

    const dispatch = useAppDispatch();
    function processDispatch(loginObject: LoginObject) {
        dispatch(login(loginObject))
    }
    function processDispatchLogOut() {
        dispatch(logout());
    }
    return (
        <>
            <div className="login-container">
                <div className="login-section">
                    <img src={Logo} alt="blueinit logo" />
                    <div className="card login-card">
                        <div className="card-body">
                            <LoginForm processDispatch={processDispatch} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}