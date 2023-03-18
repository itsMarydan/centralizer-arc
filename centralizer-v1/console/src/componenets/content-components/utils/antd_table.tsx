import {Table, TableProps} from 'antd';
import type {SorterResult} from 'antd/es/table/interface';
import React from 'react';
import {useNavigate} from "react-router-dom";

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
}

interface Props{
    rowSelection: any,
    columns: any,
    dataSource: any,
    loading: boolean,
    setSortedInfo: any,
    navObject: any
}
const DataTable = (props: Props) => {

    const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        props.setSortedInfo(sorter as SorterResult<DataType>);
    };

    const tableProps: TableProps<DataType> = {
        bordered: false,
        loading: props.loading,
        size:'middle',
        rowSelection: props.rowSelection,
    };
    const navigate = useNavigate();

    return (
        <>
            <Table  {...tableProps}
                    onRow={(record : any, rowIndex) => {
                        return {
                            onClick: event => {
                                navigate(`/app/${props.navObject.appSlug}/edit-content/${props.navObject.contentSlug}/${record.identifier}`)
                            },
                        };
                    }}
                    columns={props.columns} dataSource={props.dataSource}
                    onChange={handleChange} />
        </>
    );
};

export default DataTable;
