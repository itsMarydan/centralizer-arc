import {Navigate, useLocation} from 'react-router-dom';
import {useAppSelector} from "../app/hooks";
import {selectLoggedIn} from "../features/auth/authSlice";

const GeneralLock = ({children}: any) => {

    const location = useLocation();
    const isLoggedIn = useAppSelector(selectLoggedIn);
    if(!isLoggedIn) return <Navigate to={`/login`} state={{ from: location }}  replace />

    return children
}


export default  GeneralLock;