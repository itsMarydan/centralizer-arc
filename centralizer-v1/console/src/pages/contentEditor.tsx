import Layout from "../layout";
import {PageTop} from "../componenets/content-components/edit-content-top";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectPermittedApps, selectUserRole} from "../features/auth/authSlice";
import {fetchBuilder, selectContent, selectContentBuilder, setContent} from "../features/contents/contentsSlice";
import React from "react";
import {EditContentForm} from "../componenets/content-components/edit-content-form";
import contentsApi from "../api/contentsApi";

const ContentEditor =  () => {
    const {appSlug, contentSlug, identifier} = useParams();
    const permittedApps = useAppSelector(selectPermittedApps);
    const findApp = permittedApps.find((app) => app.appSlug === appSlug);
    const currentUserRole = useAppSelector(selectUserRole);
    const dispatch = useAppDispatch();
    const builder = useAppSelector(selectContentBuilder);
    const content = useAppSelector(selectContent);

    async function getContent() {
        const retrieveContent = await contentsApi.getContentItem(appSlug ? appSlug : "", contentSlug ? contentSlug : "", currentUserRole.role, identifier);
        dispatch(setContent(retrieveContent))
    };

    React.useEffect(() => {
        dispatch(fetchBuilder({appSlug: appSlug, slug: contentSlug, userRole: currentUserRole}));
        getContent().then()
        console.log("content", content)
    }, [dispatch]);



    return (
        <>
            <Layout>
                <div className="mt-2">
                    <PageTop contentSlug={contentSlug ? contentSlug : ""}
                             appSlug={appSlug ? appSlug : ""}
                             contentName={builder?.contentName ? builder.contentName : ""}
                             appName={findApp?.appName ? findApp.appName : ""}
                             identifier={identifier ? identifier : ""}
                    />
                    <EditContentForm appSlug={appSlug ? appSlug : ""}
                                     content={content}
                                     slug={contentSlug ? contentSlug : ""}
                                     userRole={currentUserRole ? currentUserRole.role : ""}
                                     builder={builder}
                                     identifier={identifier ? identifier : ""}
                    />
                </div>
            </Layout>
        </>
    );


}

export  default  ContentEditor;