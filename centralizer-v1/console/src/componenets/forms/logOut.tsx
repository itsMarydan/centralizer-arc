import {useAppDispatch} from "../../app/hooks";
import {logout} from "../../features/auth/authSlice";

export const LogOut = () => {

    const dispatch = useAppDispatch();

    function  logOutFunction() {
        dispatch(logout());
    }

    return (
        
            <>
            <button onClick={() => logOutFunction()} className="btn mx-3 btn-outline-light">Log Out</button>
            </>
        
    )
}