import Logo from '../assets/images/logo.png';
import {SignUpForm} from "../componenets/forms/signupForm";
import {RegisterForm} from "../componenets/forms/registerForm";


export const SignUp = () => {

    return (
        <>
            <div className="login-container">
                <div className="login-section">
                    <img src={Logo} alt="blueinit logo" />
                    <div className="card login-card">
                        <div className="card-body">
                            <RegisterForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}