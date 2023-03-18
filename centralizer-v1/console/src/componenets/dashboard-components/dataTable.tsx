import React from "react";
import EnhancedTable from "../global/mui-table";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectAppsTableData, updateAppsTableDataDefault} from "../../features/auth/authSlice";

type MyProps = {
    data: any;
    headerCells: any;
    identifier: any;
    hasHandlePin: boolean;
    handlePin?: any;
    hasHandleDelete: boolean;
    handleDelete?:  any

};


 const DataTable = (props: MyProps) =>{
    const dispatch = useAppDispatch();
    const data = useAppSelector(selectAppsTableData);
React.useEffect(() => {
    dispatch(updateAppsTableDataDefault(props.data))
}, [ props.data])

        return (
            <>
                {data ?
                    <EnhancedTable hasSelector={true}  url={"/app"} handleDelete={props.handleDelete} hasHandleDelete={props.hasHandleDelete} hasHandlePin={props.hasHandlePin} handlePin={props.handlePin} identifier={props.identifier} data={data} headCells={props.headerCells}/>
                    : null}
            </>
        )

}

export  default  DataTable;