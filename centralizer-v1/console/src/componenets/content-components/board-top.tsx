import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import React from "react";
import {useNavigate} from "react-router-dom";

interface Props{
    appSlug: string,
    appName: string,
    contentName: string,
    contentSlug: string

}
export function PageTop(props : Props){
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/">
            Applications
        </Link>,
        <Link
            underline="hover"
            key="2"
            color="inherit"
            href={`/app/${props.appSlug}`}
        >{props.appName}
        </Link>,
        <Typography key="3" >
            {props.contentName}
        </Typography>,
    ];
    const navigate = useNavigate();
    return(
        <>

            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    {breadcrumbs}
                </Breadcrumbs>
                <div className="action-items">
                    <button onClick={() => {
                        navigate(`/app/${props.appSlug}/create-content/${props.contentSlug}`)
                    }} className="btn btn-sm btn-outline-primary">+ New</button>
                </div>
            </div>

        </>
    )
}