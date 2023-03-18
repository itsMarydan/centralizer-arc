import {Link} from "react-router-dom";
import {systemData} from "../../data/systemData";
import {selectUserProfile} from "../../features/auth/authSlice";
import {useAppSelector} from "../../app/hooks";
import {LogOut} from "../../componenets/forms/logOut";

const Header  = () => {
    const userProfile = useAppSelector(selectUserProfile);
    return(
        <>
            <header className="navbar navbar-dark sticky-top  bg-blue flex-md-nowrap p-0 shadow">
                <div className={"navbar-brand col-md-3 col-lg-2"}>
                    <Link to="/"><span
                        className="me-0 elegance px-3">{systemData.applicationName}</span></Link>
                </div>

                <button className="navbar-toggler position-absolute d-md-none collapsed" type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-nav d-none-on-mobile">
                    <div className="nav-item text-nowrap name-icon-box">
                        <LogOut />
                        <Link  to="/profile"><span className="name-icon">{userProfile ? userProfile.firstName ? userProfile.firstName.charAt(0) : "N" : "N"}</span></Link>
                    </div>
                </div>
            </header>
        </>
    )
    
}


export default Header;