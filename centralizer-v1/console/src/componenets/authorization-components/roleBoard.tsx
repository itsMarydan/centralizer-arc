import React from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchRoles, selectRoles,} from "../../features/authorize/authorizeSlice";
import {Roles} from "../../models/rules";
import {RolesTable} from "./roles-table";

interface DataType {
    roleName: string,
    roleDisplay: string,
    roleId: number,
    role: string,
    policies: number[],
    roleType: string,
}


export function RolesBoard(){
    const dispatch = useAppDispatch();
    const roles = useAppSelector(selectRoles);

    function createData(roleName: string, roleDisplay: string, roleId: number,role: string, policies: number[], roleType: string ): DataType{
        return {
            roleName,
            roleDisplay,
            role,
            roleId,
            roleType,
            policies,
        };
    }
    React.useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    function generateData ( ): DataType[] {
        const Data: any= [];
        roles?.forEach((role: Roles, key: any) => {
            const created = createData(role.roleName, role.roleDisplay, role.roleId, role.role, role.policies, role.roleType);
            Data.push(created)
        })
        return Data;
    }
    const data: DataType[] = generateData();
    return(
        <>
            <RolesTable tableData={data}/>
        </>
    )
}