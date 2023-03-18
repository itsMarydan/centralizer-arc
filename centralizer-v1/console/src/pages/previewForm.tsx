import Layout from "../layout";
import React from "react";
import {PageTop} from "../componenets/form-components/preview-form-top";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectPermittedApps, selectUserRole} from "../features/auth/authSlice";
import {fetchBuilder, fetchForms, fetchSchema, selectForms, selectFormsBuilder} from "../features/forms/formsSlice";
import {PreviewFormForm} from "../componenets/form-components/preview-form-form";

export function PreviewForm(){
    const { appSlug, formSlug } = useParams();
    const permittedApps = useAppSelector(selectPermittedApps);
    const findApp = permittedApps.find((app) => app.appSlug === appSlug);
    const currentUserRole = useAppSelector(selectUserRole);
    const dispatch = useAppDispatch();
    const builder = useAppSelector(selectFormsBuilder);
    const forms = useAppSelector(selectForms);

    React.useEffect(() => {
        dispatch(fetchBuilder({appSlug: appSlug, slug: formSlug, userRole: currentUserRole}));
        dispatch(fetchSchema({appSlug: appSlug, slug: formSlug, userRole: currentUserRole}));
        dispatch(fetchForms({appSlug: appSlug, slug: formSlug, userRole: currentUserRole}));
    }, [dispatch]);
    return(
        <Layout>
            <div className="mt-2">
                <PageTop appName={findApp?.appName ? findApp.appName : ""}
                         appSlug={appSlug ? appSlug : ""} formName={builder?.formName ? builder?.formName : ""}
                         formSlug={formSlug ? formSlug : ""}/>
                <PreviewFormForm appSlug={appSlug ? appSlug : ""} builder={builder ? builder : ""}
                                 slug={formSlug ? formSlug : ""} userRole={currentUserRole.role ?  currentUserRole.role : ""}/>
            </div>
        </Layout>
    )
}