import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectPermittedApps, selectUserRole} from "../features/auth/authSlice";
import Layout from "../layout";
import {roleTypes} from "../static/user-utils";
import {Navigate, useLocation, useParams} from "react-router-dom";
import React from "react"
import {PageTop} from "../componenets/content-components/page-top";
import {BuilderCreators} from "../builders/contentBulderParts/builderCreators";
import {BuilderFields} from "../builders/contentBulderParts/BuilderFields";
import {fetchBuilder, selectContentBuilder} from "../features/contents/contentsSlice";
import {DATA_TYPE} from "../static/app-values";

const ContentBuilder = () => {

    const { appSlug, contentSlug } = useParams();
    const location = useLocation();
    const currentUserRole = useAppSelector(selectUserRole);
    const permittedApps = useAppSelector(selectPermittedApps);
    const findApp = permittedApps.find((app) => app.appSlug === appSlug);
    const [showFieldSelector, setShowFieldSelector] = React.useState(false);
    const [fieldType, setFieldType] = React.useState('');
    const builder = useAppSelector(selectContentBuilder);
    const handleShowFieldSelector = () => setShowFieldSelector(true);

    const dispatch = useAppDispatch();

    React.useEffect(() => {
            dispatch(fetchBuilder({appSlug: appSlug, slug: contentSlug, userRole: currentUserRole}))
    }, [dispatch])


    if(currentUserRole.roleName !== roleTypes.SUPER_ADMIN) return  <Navigate to={`/unauthorized`} state={{ from: location }}  replace />
    return (
        <Layout>
            <PageTop userRole={currentUserRole ? currentUserRole.role : ""} builder={builder}
                     showFieldSelector={handleShowFieldSelector}  appName={findApp?.appName? findApp?.appName : ""}
                     contentName={builder?.contentName ? builder.contentName : "" } appSlug={appSlug ? appSlug : ""} />
            <BuilderCreators appSlug={appSlug ? appSlug : ''} slug={contentSlug? contentSlug : ""}
                             userRole={currentUserRole ? currentUserRole.role : ""} setFieldType={setFieldType}
                             showFieldSelector={showFieldSelector}
                             setShowFieldSelector={setShowFieldSelector} selectedFiledType={fieldType}  dataType={DATA_TYPE.content}/>
            <BuilderFields appSlug={appSlug ? appSlug : ''} slug={contentSlug ? contentSlug : ""}
                           userRole={currentUserRole ? currentUserRole.role : ""} builder={builder}  dataType={DATA_TYPE.content}/>
        </Layout>
    )
}

export default ContentBuilder;