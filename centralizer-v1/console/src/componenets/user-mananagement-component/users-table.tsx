import React from "react";
import {Input, InputRef, Table} from "antd";
import {ColumnType} from "antd/es/table";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {ColumnsType} from "antd/es/table/interface";
import {capitalize} from "../../helper/caseChange";
import {MdModeEditOutline} from "react-icons/md";
import {AiTwotoneDelete} from "react-icons/ai";

interface DataType {
    fullName: string,
    email: string,
    role: string,
    isActive: boolean,
}
interface Props{
    tableData: DataType[],
}
type DataIndex = keyof DataType;
export function UsersTable(props: Props){
    const [dataSource, setDataSource] = React.useState<DataType[]>(props.tableData);
    React.useEffect(() => {
        setDataSource(props.tableData)
    }, [props.tableData])
    const [searchText, setSearchText] = React.useState('');
    const [searchedColumn, setSearchedColumn] = React.useState('');
    const [loading, ] = React.useState(false);
    const searchInput = React.useRef<InputRef>(null);

    const handleSearch = ( search: any, dataIndex: DataIndex,) => {
        setSearchText(search);
        setSearchedColumn(dataIndex)
        const filteredData = props.tableData.filter((data: any) =>
            data[dataIndex].toString().toLowerCase().includes(search.toString().toLowerCase()));
        !search ? setDataSource(props.tableData) : setDataSource(filteredData);
    }
    const handleDelete = async (key: any, record: any) => {
        // const newData = dataSource.filter(item => item.key !== key);
        // await formsApi.deleteFormItem(props.appSlug, props.formSlug, props.userRole, record.identifier);
        // setDataSource(newData);
    }
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

    const columns: ColumnsType<any> = [
        {
            title: capitalize("Name"),
            dataIndex: 'fullName',
            key: 'fullName',
            ...getColumnSearchProps('fullName'),
        },
        {
            title: capitalize("Email"),
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            ...getColumnSearchProps('role'),
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (text: any, record: any) =>{   return(
                record.isActive ? "YES" : "NO"
            )   }
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
            render: (text: any, record: any) =>{
                return(
                    <span>
                        <a onClick={() => handleDelete(record.key, record)}><MdModeEditOutline /></a>
                        <a className={"mx-2"} onClick={() => handleDelete(record.key, record)}><AiTwotoneDelete /></a>

                    </span>

                )
            }
        }
    ];

    return (
        <>
            <div>
                {dataSource &&
                    <Table columns={columns} rowKey={"userId"} pagination={{ pageSize: 50 }} dataSource={dataSource} size="middle"  bordered={false} />
                }
            </div>
        </>
    )
}