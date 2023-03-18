import {selectUserRole} from "../../features/auth/authSlice";
import {useAppSelector} from "../../app/hooks";
import React from "react";
import {roleTypes} from "../../static/user-utils";
import {UserCreateModal} from "./create-user/user-create-modal";

export function PageTop() {
    const currentUserRole = useAppSelector(selectUserRole);
    const [showCreateUser, setShowCreateUser] = React.useState(false);
    const handleCloseCreateUser = () => setShowCreateUser(false);
    const handleShowCreateUser = () => setShowCreateUser(true);
    return (
        <div className="page-top">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">{currentUserRole.roleName === roleTypes.SUPER_ADMIN ? "User Management" : "Users"}</h1>

                <div className="btn-toolbar float-right mb-2 mb-md-0">
                    { (currentUserRole.roleName === roleTypes.SUPER_ADMIN) ?
                        <button onClick={() => handleShowCreateUser()} type="button" className="btn btn-sm btn-outline-primary">
                            <span>+</span>
                            Create User
                        </button>
                        :
                        null
                    }
                </div>
                <UserCreateModal show={showCreateUser} handleClose={handleCloseCreateUser} />
            </div>
        </div>
    )
}