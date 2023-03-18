import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import React from "react";
import { HiRefresh } from "react-icons/hi";

interface Props{
    appSlug: string,
    appName: string,
    contentName: string,
    contentSlug: string
}

export function PageTop(props : Props) {
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
        <Link
            underline="hover"
            key="2"
            color="inherit"
            href={`/app/${props.appSlug}/content/${props.contentSlug}`}
        >{props.contentName}
        </Link>,
        <Typography key="3" >
            New
        </Typography>,
    ];
    return(
        <>

            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    {breadcrumbs}
                </Breadcrumbs>
                <div className="action-items">
                    <button onClick={() => ("")} className="btn btn-outline-primary"><HiRefresh /></button>
                </div>
            </div>
        </>
    )
}