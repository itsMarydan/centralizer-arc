import {Link} from "react-router-dom";
import {useAppSelector} from "../../app/hooks";
import {navData} from "../../data/navigation";
import {selectPermittedApps} from "../../features/auth/authSlice"
import {capitalize} from "../../helper/caseChange";

const SideBar = ( ) => {
    const permittedApps = useAppSelector(selectPermittedApps);
    return (
        <>
         <nav  id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="position-sticky">
                <ul className="nav flex-column">
                    {permittedApps.length ?
                        <li className="mb-1 nav-item">
                        <button className="w-100 btn-toggle align-items-center rounded collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#application-collapse" aria-expanded="false">
                            Applications
                        </button>
                        <div className="collapse" id="application-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                {permittedApps ? permittedApps.map((item: any, key: any) => (
                                    <li key={key}><Link to={`/app/${item.appSlug}`}>
                                        <span className="nav-link rounded">{capitalize(item.appName)}</span>
                                    </Link></li>
                                )): null}
                            </ul>
                        </div>
                    </li> :
                        <></>}
                    <li className="mb-1 nav-item">
                        <button className="w-100 btn-toggle align-items-center rounded collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#permissions-collapse" aria-expanded="false">
                            Permissions
                        </button>
                        <div className="collapse" id="permissions-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                {navData.permissions.map((item, key) => (
                                    <li key={key}><Link to={`${item.link}`}>
                                        <span className="nav-link rounded">{item.display}</span>
                                    </Link></li>
                                ))}
                            </ul>
                        </div>
                    </li>
                    {navData.main.map((item, key) => (
                        <li key={key} className="nav-item pad-20">
                            <Link to={`${item.link}`}>
                                <span className="nav-link cp-2">{item.display}</span>
                            </Link>
                        </li>
                    ))}

                </ul>
            </div>
        </nav>
        </>
    )
}

export default SideBar;