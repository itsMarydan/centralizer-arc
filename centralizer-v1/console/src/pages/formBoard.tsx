import Layout from "../layout";
import {PageTop} from "../componenets/form-components/board-top";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import { selectPermittedApps, selectUserRole} from "../features/auth/authSlice";
import {
    fetchBuilder,
    fetchForms,
    fetchSchema,
    selectForms,
    selectFormsBuilder,
    selectSchema
} from "../features/forms/formsSlice";
import React from "react";
import {FormsTable} from "../componenets/form-components/forms-table";

interface DataType {
    key: string;
    identifier: any,
    createdOn: any,
}

const  FormBoard = () =>{
    const { appSlug, formSlug } = useParams();
    const permittedApps = useAppSelector(selectPermittedApps);
    const findApp = permittedApps.find((app) => app.appSlug === appSlug);
    const currentUserRole = useAppSelector(selectUserRole);
    const dispatch = useAppDispatch();
    const builder = useAppSelector(selectFormsBuilder);
    const schema = useAppSelector(selectSchema);
    const forms = useAppSelector(selectForms);

    React.useEffect(() => {
        dispatch(fetchBuilder({appSlug: appSlug, slug: formSlug, userRole: currentUserRole}));
        dispatch(fetchSchema({appSlug: appSlug, slug: formSlug, userRole: currentUserRole}));
        dispatch(fetchForms({appSlug: appSlug, slug: formSlug, userRole: currentUserRole}));
    }, [appSlug, currentUserRole, dispatch, formSlug]);

    function createData(key: string, identifier: any, createdOn: any, ): DataType{
        return {
            key,
            identifier,
            createdOn,
        };
    }

    function generateData ( ): any {
        const Data: any= [];
        forms?.forEach((form:any, key: any) => {
            const created = createData((key).toString(), form[schema.identifier],
                form.bcCreatedOn);
            Data.push(created)
        })
        return Data;
    }
    const data: DataType[] = generateData();

    return (
        <>
            <Layout>
                <PageTop appName={findApp?.appName ? findApp.appName : ""}
                         appSlug={appSlug ? appSlug : ""}  formName={builder?.formName ? builder?.formName : ""} formSlug={formSlug ? formSlug : ""}/>
                {data &&
                    <FormsTable userRole={currentUserRole} formSlug={ formSlug ? formSlug : ""} appSlug={appSlug ? appSlug : ""} tableData={data} data={forms ? forms : []} identifier={schema.identifier ? schema.identifier : "" } />
                }
            </Layout>
        </>
    )
}

export default FormBoard;