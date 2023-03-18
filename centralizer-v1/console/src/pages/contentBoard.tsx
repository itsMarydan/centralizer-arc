import Layout from "../layout";
import {PageTop} from "../componenets/content-components/board-top";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectCurrentUser, selectPermittedApps, selectUserRole} from "../features/auth/authSlice";
import React from "react";
import {
    fetchBuilder,
    fetchContents,
    fetchSchema,
    selectContentBuilder,
    selectContents,
    selectContentSchema
} from "../features/contents/contentsSlice";
import {ItemsTable} from "../componenets/content-components/items-table";
import {fetchUserList, selectUserList} from "../features/user/userSlice";

interface DataType {
    key: string;
    identifier: any,
    createdOn: any,
    createdBy: any
    status: boolean,
    lastModified: any
}

const ContentBoard = () => {
    const { appSlug, contentSlug } = useParams();
    const permittedApps = useAppSelector(selectPermittedApps);
    const findApp = permittedApps.find((app) => app.appSlug === appSlug);
    const currentUserRole = useAppSelector(selectUserRole);
    const dispatch = useAppDispatch();
    const builder = useAppSelector(selectContentBuilder);
    const users = useAppSelector(selectUserList);
    const schema = useAppSelector(selectContentSchema);
    const contents = useAppSelector(selectContents);
    const currentUser = useAppSelector(selectCurrentUser);
    React.useEffect(() => {
        dispatch(fetchBuilder({appSlug: appSlug, slug: contentSlug, userRole: currentUserRole}));
        dispatch(fetchSchema({appSlug: appSlug, slug: contentSlug, userRole: currentUserRole}));
        dispatch(fetchContents({appSlug: appSlug, slug: contentSlug, userRole: currentUserRole}));
        dispatch(fetchUserList())
    }, [dispatch]);
    function createData(key: string, identifier: any, createdOn: any, createdBy: any, status: boolean, lastModified: any): DataType{
        return {
            key,
            identifier,
            createdOn,
            createdBy,
            status,
            lastModified
        };
    }

    function generateData ( ): any {
        const Data: any= [];
        contents?.forEach((content:any, key: any) => {
            const created = createData((key).toString(), content[schema.identifier],
                content.bcCreatedOn, returnUserDisplay(content.bcCreatedBy, currentUser?.userId),
                content.bcPublish, content.bcLastModified);
            Data.push(created)
        })
        console.log(Data, "my data")
        return Data;
    }

    function findUserIndex(userId: any) {
        return users.findIndex(((user: any) => user.userId == userId));
    }

    function returnUserDisplay(id: number, userId: any){
        if( id === userId ){
            return "Me"
        }else {
            return  users[findUserIndex(id)] ? users[findUserIndex(id)].firstName + ` ` + users[findUserIndex(id)].lastName :  "System";
        }
    }

    const data: DataType[] = generateData();
    return (
        <>
            <Layout>
                <div className="mt-2">
                    <PageTop contentSlug={ contentSlug ? contentSlug : ""} appName={findApp?.appName ? findApp.appName : ""}
                             appSlug={appSlug ? appSlug : ""} contentName={builder?.contentName ? builder.contentName : ""} />
                    {data &&
                        <ItemsTable userRole={currentUserRole} contentSlug={ contentSlug ? contentSlug : ""} appSlug={appSlug ? appSlug : ""} tableData={data} data={contents ? contents : []} identifier={schema.identifier ? schema.identifier : "" } />
                    }
                </div>
            </Layout>
        </>
    )
}


export  default  ContentBoard;