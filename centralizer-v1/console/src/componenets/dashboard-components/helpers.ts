import {getAppStatus} from "../../static/app-values";

interface DataType {
    key: string;
    name: string,
    slug: string,
    manager: string
    status: boolean,
    secrets: number
}
export function returnUserFullName( userId: any, userList: any): string{
    if (!userList[0]?.firstName) return '';
    const user = userList?.filter((user: any) => user.userId === userId)
    return  user[0] ? `${user[0].firstName} ${user[0].lastName}` : '';
}

export function createData(key: string, name: string, slug: string, status: boolean, manager: string, secrets: number): DataType{
    return {
        key,
        name,
        slug,
        status,
        manager,
        secrets
    };
}

export function processTableData (permittedApps: any, userList: any): any {
    console.log(permittedApps, "perm")
    const rowData: any= [];
    if(permittedApps.length > 0){
        permittedApps.forEach((app:any, key: any) => {
            const manager = returnUserFullName(app.appManager, userList);
            const created = createData(key, app.appName, app.appSlug, getAppStatus(app.appStatus), `${manager ? manager : "non" }`,app.appSecrets.length);
            rowData.push(created)
        })
        return rowData;
    }
    return rowData;
}