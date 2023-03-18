import React from "react";

export function PageTop(props: any){
    return (
        <>

            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h2 >Create New User</h2>
                <button onClick={props.handleClose} className="btn btn-outline-primary">Close</button>
            </div>
        </>
    )
}