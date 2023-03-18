import { useAppSelector } from "../../app/hooks"
import { selectUserRole } from "../../features/auth/authSlice"
import {roleTypes} from "../../static/user-utils";
import React from "react";
import CreateAppModal from "../application-components/create-app-modal";
export const DashBoardTop = () => {
    const currentUserRole = useAppSelector(selectUserRole);
    const [showCreateApp, setShowCreateApp] = React.useState(false);
    const handleCloseCreateApp = () => setShowCreateApp(false);
    const handleShowCreateApp = () => setShowCreateApp(true);

    return (
        <>

            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Applications</h1>

                <div className="btn-toolbar float-right mb-2 mb-md-0">
                    { (currentUserRole.roleName === roleTypes.SUPER_ADMIN) ?
                        <button onClick={() => handleShowCreateApp()} type="button" className="btn btn-sm btn-outline-primary">
                            <span>+</span>
                            Create Application
                        </button>
                        :
                        null
                    }
                </div>
            </div>
            <CreateAppModal  handleCloseCreateApp={handleCloseCreateApp} showCreateApp={showCreateApp} />
        </>
    )
} 