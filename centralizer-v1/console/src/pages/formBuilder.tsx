import Layout from "../layout";
import {PageTop} from "../componenets/form-components/builder-page-top";
import {useLocation, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectPermittedApps, selectUserRole} from "../features/auth/authSlice";
import React from "react";
import {fetchBuilder, selectFormsBuilder} from "../features/forms/formsSlice";
import {BuilderCreators} from "../builders/contentBulderParts/builderCreators";
import {BuilderFields} from "../builders/contentBulderParts/BuilderFields";
import {DATA_TYPE} from "../static/app-values";

const FormBuilder = () => {

    const { appSlug, formSlug } = useParams();
    const location = useLocation();
    const currentUserRole = useAppSelector(selectUserRole);
    const permittedApps = useAppSelector(selectPermittedApps);
    const findApp = permittedApps.find((app) => app.appSlug === appSlug);
    const [showFieldSelector, setShowFieldSelector] = React.useState(false);
    const [fieldType, setFieldType] = React.useState('');
    const builder = useAppSelector(selectFormsBuilder);
    const handleShowFieldSelector = () => setShowFieldSelector(true);

    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(fetchBuilder({appSlug: appSlug, slug: formSlug, userRole: currentUserRole}))
    }, [dispatch])


    return(
        <Layout>
            <PageTop  appName={findApp?.appName? findApp?.appName : ""} appSlug={ appSlug ? appSlug : ""}
                      builder={builder} formName={builder?.formName ? builder.formName : "" }
                      showFieldSelector={handleShowFieldSelector}  userRole={currentUserRole ? currentUserRole.role : ""} />
            <BuilderCreators appSlug={appSlug ? appSlug : ''} slug={formSlug? formSlug : ""}
                             userRole={currentUserRole ? currentUserRole.role : ""}
                             setFieldType={setFieldType} showFieldSelector={showFieldSelector}
                             setShowFieldSelector={setShowFieldSelector} selectedFiledType={fieldType}  dataType={DATA_TYPE.form}/>
            <BuilderFields appSlug={appSlug ? appSlug : ''} slug={formSlug ? formSlug : ""}
                           userRole={currentUserRole ? currentUserRole.role : ""} builder={builder}  dataType={DATA_TYPE.form}/>
        </Layout>
    )
}

export default FormBuilder;