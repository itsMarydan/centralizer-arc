import {Table, TableProps} from 'antd';
import type {SorterResult} from 'antd/es/table/interface';
import React from 'react';

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
}

interface Props{
    rowSelection?: any,
    columns: any,
    dataSource: any,
    loading: boolean,
    setSortedInfo: any,
}
const DataTable = (props: Props) => {

    const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        props.setSortedInfo(sorter as SorterResult<DataType>);
    };

    const tableProps: TableProps<DataType> = props.rowSelection ?  {
        bordered: false,
        loading: props.loading,
        size:'middle',
        rowSelection: props.rowSelection,
    } : {
        bordered: false,
        loading: props.loading,
        size:'middle',
    };


    return (
        <>
            <Table  {...tableProps}

                    columns={props.columns}  dataSource={props.dataSource} onChange={handleChange} />
        </>
    );
};

export default DataTable;
