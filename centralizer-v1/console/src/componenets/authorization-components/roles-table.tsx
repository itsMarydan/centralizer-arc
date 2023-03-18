import React, {useRef, useState} from "react";
import {Input, InputRef, Table} from "antd";
import {ColumnType} from "antd/es/table";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {ColumnsType} from "antd/es/table/interface";
import {capitalize} from "../../helper/caseChange";
import {HiLockClosed} from "react-icons/hi";
import {AiTwotoneDelete} from "react-icons/ai";

interface Props{
    tableData: DataType[],

}
interface DataType {
    roleName: string,
    roleDisplay: string,
    roleId: number,
    role: string,
    policies: number[],
    roleType: string,
}
type DataIndex = keyof DataType;

export function RolesTable(props: Props){
    const [dataSource, setDataSource] = useState<DataType[]>(props.tableData);
    React.useEffect(() => {
        setDataSource(props.tableData)
    }, [props.tableData])

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, ] = React.useState(false);
    const searchInput = useRef<InputRef>(null);

    const handleSearch = ( search: any, dataIndex: DataIndex,) => {
        setSearchText(search);
        setSearchedColumn(dataIndex)
        const filteredData = props.tableData.filter((data: any) =>
            data[dataIndex].toString().toLowerCase().includes(search.toString().toLowerCase()));
        !search ? setDataSource(props.tableData) : setDataSource(filteredData);
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: () => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    onChange={e => handleSearch(e.target.value, dataIndex) }
                    style={{ marginBottom: 8, display: 'block' }}
                />
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const handleDelete = async (key: any, record: any) => {
        // const newData = dataSource.filter(item => item.key !== key);
        // await formsApi.deleteFormItem(props.appSlug, props.formSlug, props.userRole, record.identifier);
        // setDataSource(newData);
    };

    const columns: ColumnsType<any> = [
        {
            title: capitalize("Role ID"),
            dataIndex: 'roleId',
            key: 'roleId',
            ...getColumnSearchProps('roleId'),
        },
        {
            title: capitalize("Role Name"),
            dataIndex: 'roleDisplay',
            key: 'roleDisplay',
            ...getColumnSearchProps('roleDisplay'),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            ...getColumnSearchProps('role'),
        },
        {
            title: 'Policies',
            dataIndex: 'policies',
            key: 'policies',
            render: (text: any, record: any) =>{
                return(
                    <div>{record.policies.toString()}</div>
                )
            }
        },
        {
            title: capitalize("Role Type"),
            dataIndex: 'roleType',
            key: 'roleType',
            ...getColumnSearchProps('roleType'),
        },

        {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete',
            render: (text: any, record: any) =>{
                return(
                    record.isLocked ? <HiLockClosed /> : <AiTwotoneDelete onClick={() => handleDelete(record.key, record)}/>
                )
            }
        }
    ];

    return(
        <>
            <Table columns={columns} rowKey={"roleId"} pagination={{ pageSize: 50 }} dataSource={dataSource} size="middle"  bordered={false} />
        </>
    )
}