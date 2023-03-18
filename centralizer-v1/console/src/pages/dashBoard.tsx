import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {
    selectCurrentUser,
    selectPermittedApps,
    selectPinnedAppOrder,
    selectUserOptions,
    selectUserRole,
    updatePinnedAppsOrder, userOptionsRefresh
} from "../features/auth/authSlice";
import {fetchUserList, selectUserList} from "../features/user/userSlice";
import Layout from "../layout"
import {DashBoardTop} from "../componenets/dashboard-components/page-top";
import PinnedApplications from "../componenets/dashboard-components/pinned-applications"
import {userUtils} from "../static/user-utils"
import authApi from "../api/authApi";
import {APPS_API} from "../static/api-url";
import axiosClient from "../api/axiosClient";
import {ApplicationTable} from "../componenets/dashboard-components/application-table";
import {processTableData} from "../componenets/dashboard-components/helpers";

const DashBoard = ( ) => {

    const permittedApps = useAppSelector(selectPermittedApps);
    const  currentUser = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const userList = useAppSelector(selectUserList);
    const [pinMessage, setPinMessage] = useState<String>();
    const currentUserOptions = useAppSelector(selectUserOptions);
    const appOrder = useAppSelector(selectPinnedAppOrder);
    const currentUserRole = useAppSelector(selectUserRole);
    useEffect(() => {
      dispatch(fetchUserList())
        dispatch(userOptionsRefresh())
  }, [dispatch])


    interface DataType {
        key: string;
        name: string,
        slug: string,
        manager: string
        status: boolean,
        secrets: number
    }
      

      async function setNewPinnedApps(updates: any, newOrder: Array<String>) {
        console.log("Set Pinned App", currentUser?.userId)
          const userId: number = currentUser?.userId ? currentUser?.userId : 0;
        console.log("Set Pinned App", userId)
          await authApi.updateOptions(userId, userUtils.PINNED_APPS, updates);
          dispatch(updatePinnedAppsOrder(newOrder))

      }



    function handlePin(selected : Array<string>) {
        if(selected.length <=0){
            setPinMessage("Nothing was selected");
            setTimeout(function(){
                setPinMessage("");
            },2000);
        }else{

            const newApp = selected.filter(app => !appOrder?.includes(app));
            const alreadyPinned = selected.filter(app => appOrder?.includes(app))
            let updatedAppsOrder: any = [];

            console.log("Apps", newApp)
            const newPinnedAppCount  = newApp.length + ( appOrder ? appOrder?.length : 0);
            if(newApp.length === 0){
              setPinMessage("No new Pinned Apps Created");
              setTimeout(function(){
                setPinMessage("");
              },2000);
            }else{
                if(newPinnedAppCount > userUtils.MAX_PINNED_APPS) {
                    setPinMessage( `Maximum PinnedApps exceeded, you can only have ${userUtils.MAX_PINNED_APPS} pinned apps at any given time`);
                    setTimeout(function(){
                        setPinMessage("");
                    },2000);
                } else{
                    if(alreadyPinned.length > 0){
                        setPinMessage( `These are already Pinned, "${alreadyPinned.join(", ")}".`);
                        setTimeout(function(){
                            setPinMessage("");
                        },2000);
                    }else{
                        appOrder?.forEach(app => updatedAppsOrder?.push(app))
                        newApp.forEach(app => updatedAppsOrder?.push(app))
                        console.log("updated value",updatedAppsOrder)
                        const updates = {
                            "optionConfig": {
                                "appOrder": updatedAppsOrder
                            }
                        }
                        setNewPinnedApps(updates, updatedAppsOrder)
                        setPinMessage( `Success!`);
                        setTimeout(function(){
                            setPinMessage("");
                        },2000);
                    }
                }

            }
    
            console.log("Arrays removed", newApp)
        }
    }
    function handleDelete (selected : Array<string>){
            console.log("handle delete", selected)
            selected.forEach(appSlug => {
                const url = APPS_API.SOFT_DELETE_APP(appSlug)
                axiosClient.put(url);
            })
    }
    const data = processTableData(permittedApps, userList);
    const pinnedApps = currentUserOptions.find( option => option.optionType === userUtils.PINNED_APPS );
    function retrieveNewOptions(updates: any, newOrder: Array<String>){
        const userId: number = currentUser?.userId ? currentUser?.userId :  0;
        authApi.updateOptions(userId, userUtils.PINNED_APPS, updates);
        dispatch(updatePinnedAppsOrder(newOrder))

    }
    function  unpinApp(appSlug: string){

        const newAppOrder: any = appOrder?.filter((app) => app !== appSlug);
        const updates = {
            "optionConfig": {
                "appOrder": newAppOrder
            }
        }
        console.log(newAppOrder)
        retrieveNewOptions(updates, newAppOrder)
    }


    return (
        <Layout>
          <div className="mt-5">
            <DashBoardTop />
          </div>
            <div className="pinned-apps mt-5">
                {pinnedApps ?
                  <PinnedApplications unpinApp={unpinApp} appOrder={appOrder} currentUser={currentUser} dispatch={dispatch} currentUserOptions={currentUserOptions} permittedApps={permittedApps} />
                  : null
                }
            </div>
            { data ?
            <>
              <div className="mt-5">
                {pinMessage ? pinMessage : null}
              </div>

                { userList
                    &&
                    <ApplicationTable  handleDelete={handleDelete} handelPin={handlePin} data={data}  userRole={currentUserRole}/>
                }
            </>:
             null}
        </Layout>
    )
}


export default DashBoard;