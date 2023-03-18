import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectLoggedIn, selectPermittedApps, selectUserRole} from "../features/auth/authSlice";
// @ts-ignore
import {Navigate, useLocation, useParams} from "react-router-dom";
import Layout from "../layout";
import {ApplicationBoardTop} from "../componenets/application-components/page-top";
import {DataTypeCreator} from "../componenets/application-components/data-type-creator";
import {DataByTypeTable} from "../componenets/application-components/data-by-type-table";
import React from "react";
import {
    fetchContentList,
    selectContentList,
    selectFileGallery,
    setFileGallery
} from "../features/contents/contentsSlice";
import {Tabs} from "antd";
import {DATA_TYPE} from "../static/app-values";
import {fetchFormList, selectFormsList} from "../features/forms/formsSlice";
import {FileGallery} from "../componenets/global/file-gallery";
import axiosClient from "../api/axiosClient";
import {GLOBAL_API} from "../static/api-url";
import {FilesFormDash} from "../componenets/files/filesForm";

interface DataType {
    key: string;
    name: string,
    slug: string,
    type: string
    status: boolean,
    fieldsCount: number
}

const ApplicationBoard = () => {
    const { appSlug } = useParams();
    const dispatch = useAppDispatch();
    const contentData = useAppSelector(selectContentList);
    const formData = useAppSelector(selectFormsList);
    const location = useLocation();
    const isLoggedIn = useAppSelector(selectLoggedIn);
    const permittedApps = useAppSelector(selectPermittedApps);
    const currentUserRole = useAppSelector(selectUserRole);
    const fileGallery = useAppSelector(selectFileGallery);
    async function retrieveFiles() {
        const files: any = await axiosClient.get(GLOBAL_API.GET_FILE_BY_APP());
        dispatch(setFileGallery(files));

    }
    React.useEffect(() => {
        dispatch(fetchContentList(appSlug ? appSlug : ""));
        dispatch(fetchFormList(appSlug ? appSlug : ""));
        retrieveFiles().then();
    }, [ appSlug]);
    if(!isLoggedIn) return <Navigate to={`/login`} state={{ from: location }}  replace />
    const findApp = permittedApps.find((app) => app.appSlug === appSlug);
    if(!Boolean(findApp)) return <Navigate to={`/unauthorized`} state={{ from: location }}  replace />

    function createData(
        key: string,
        name: string,
        slug: string,
        type: string,
        status: boolean,
        fieldsCount: number
    ): DataType{
        return {
            key,
            name,
            slug,
            type,
            status,
            fieldsCount
        };
    }

    function generateData( dataType: number): any {
        const Data: any= [];
        dataType === DATA_TYPE.content ? contentData?.forEach((content:any, key: any) => {
            const status = content.isPublished;
            const type = content.isDynamic ? "Dynamic" : "Static";
            const created = createData((key).toString(), content.contentName,
                content.slug,
                type, status, content.fields.length);
            Data.push(created)
        }) : formData?.forEach((form:any, key: any) => {
            const status = form.isPublished;
            const type = form.isDynamic ? "Dynamic" : "Static";
            const created = createData((key).toString(), form.formName,
                form.slug,
                type, status, form.fields.length);
            Data.push(created)
        });
        return Data;
    }

    const contents: DataType[] = generateData(DATA_TYPE.content);
    const forms: DataType[] = generateData(DATA_TYPE.form);

    const items = [
        { label: 'Contents', key: '1', children:  <DataByTypeTable dataType={DATA_TYPE.content} userRole={currentUserRole} appSlug={appSlug ? appSlug : ""} data={contents}  /> }, // remember to pass the key prop
        { label: 'Forms', key: '2', children: <DataByTypeTable dataType={DATA_TYPE.form} userRole={currentUserRole} appSlug={appSlug ? appSlug : ""} data={forms}  />},
        { label: 'External', key: '3', children: "External" },
        { label: 'Files', key: '4', children: <FilesFormDash appSlug={appSlug} fileGallery={fileGallery ? fileGallery : []} />}
    ];
    return(
        <Layout>
            <div className="mt-2">
                <ApplicationBoardTop appName={findApp?.appName}/>
                <DataTypeCreator  appSlug={appSlug ? appSlug : ""} />
                <Tabs  size={"large"} items={items} />
            </div>
        </Layout>
    )
}


export default  ApplicationBoard;