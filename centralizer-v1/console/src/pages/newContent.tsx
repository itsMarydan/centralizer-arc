import Layout from "../layout";
import React from "react";
import {PageTop} from "../componenets/content-components/new-content-top";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectCurrentUser, selectPermittedApps, selectUserRole} from "../features/auth/authSlice";
import {fetchBuilder, selectContentBuilder} from "../features/contents/contentsSlice";
import {useParams} from "react-router-dom";
import {CreateContentForm} from "../componenets/content-components/create-content-form";

const NewContent = () => {
    const { appSlug, contentSlug } = useParams();
    const permittedApps = useAppSelector(selectPermittedApps);
    const findApp = permittedApps.find((app) => app.appSlug === appSlug);
    const currentUserRole = useAppSelector(selectUserRole);
    const currentUser = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const builder = useAppSelector(selectContentBuilder);
    React.useEffect(() => {
        dispatch(fetchBuilder({appSlug: appSlug, slug: contentSlug, userRole: currentUserRole}))
    }, [dispatch])
    return (
        <>
            <Layout>
                <div className="mt-2">
                    <PageTop contentSlug={contentSlug ? contentSlug : ""}
                             appName={findApp?.appName ? findApp.appName : ""}
                             appSlug={appSlug ? appSlug : ""}
                             contentName={builder?.contentName ? builder.contentName : ""} />
                    <CreateContentForm appSlug={appSlug ? appSlug : ""} builder={builder ? builder : ""}
                                       slug={contentSlug ? contentSlug :  ""} userRole={currentUserRole.role ?  currentUserRole.role : ""} userId={currentUser?.userId ? currentUser.userId : 0}/>
                </div>
            </Layout>
        </>
    )
}

export  default  NewContent;