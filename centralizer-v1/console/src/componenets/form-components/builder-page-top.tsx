import React from "react";
import {useAppDispatch} from "../../app/hooks";
import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import {camelize} from "../../helper/caseChange";
import {setIdentifiers} from "../../features/contents/contentsSlice";
import {BuildModal} from "../../builders/contentBulderParts/BuildModal";
import {DATA_TYPE} from "../../static/app-values";

interface Props{
    appSlug: string,
    appName: string,
    userRole: string
    formName: string,
    showFieldSelector: any,
    builder: any,
}

export function  PageTop(props: Props){
    const [showBuild, setShowBuild] = React.useState(false);
    const handleClose = () => setShowBuild(false);
    const dispatch = useAppDispatch();
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
            {props.formName} Builder
        </Typography>,
    ];

    function retrieveIdentifiers(){
        const identifierOptions = props.builder.fields.filter((item: any) => item.isUnique === true);
        const identifiers: any = [];
        identifierOptions.forEach((item: any) => (
            identifiers.push({value: camelize(item.fieldName), name: item.fieldName})
        ))
        dispatch(setIdentifiers(identifiers))
    }

    return(
        <>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h5 className="h4">Fields</h5>
                <div className="action-items">
                    <button onClick={() => {
                        retrieveIdentifiers();
                        setShowBuild(true)
                    }} className="btn btn-success mx-2">Build</button>
                    <button onClick={() => props.showFieldSelector()} className="btn btn-outline-primary">+ Field</button>
                </div>
            </div>
            <BuildModal appSlug={props.appSlug} userRole={props.userRole} slug={props.formName} fields={props.builder.fields ? props.builder.fields : null } show={showBuild} handleClose={handleClose} dataType={DATA_TYPE.form}/>
        </>
    )
}