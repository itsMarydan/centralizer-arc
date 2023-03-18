import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {updateAppsTableDataDefault, updatePermittedApps} from "../../features/auth/authSlice";
import React, {useRef, useState} from "react";
import {ColumnsType, SorterResult} from "antd/es/table/interface";
import {Badge, Input, InputRef, Popconfirm, Tag} from "antd";
import {ColumnType} from "antd/es/table";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {AiFillPushpin, AiTwotoneDelete} from "react-icons/ai";
import {MdOutlineUnpublished, MdPublishedWithChanges} from "react-icons/md";
import DataTable from "../global/custom_table";
import {useNavigate} from "react-router-dom";
import {ImEnter} from "react-icons/im";
import {APPS_API} from "../../static/api-url";
import axiosClient from "../../api/axiosClient";
import appsApi from "../../api/appsApi";
import {selectUserList} from "../../features/user/userSlice";
import {processTableData} from "./helpers";

type Props = {
    data: DataType[],
    handelPin: any,
    handleDelete: any,
    userRole: any
};

interface DataType {
    key: string;
    name: string,
    slug: string,
    manager: string,
    status: boolean,
    secrets: number
}
type DataIndex = keyof DataType;

export  function  ApplicationTable(props: Props){
    const dispatch = useAppDispatch();
    const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
    const [dataSource, setDataSource] = useState<DataType[]>(props.data);
    const [selectedData, setSelectedData] = useState<any[]>();
    const userList = useAppSelector(selectUserList);
    const navigate = useNavigate();
    React.useEffect(() => {
        dispatch(updateAppsTableDataDefault(props.data))
    }, [ props.data])
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, setLoading] = React.useState(false);
    const searchInput = useRef<InputRef>(null);
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            const selectedIdentifiers: any[] = [];
            selectedRows.forEach(row => (
                selectedIdentifiers.push(row.slug)
            ))
            setSelectedData(selectedIdentifiers);
        },
    };

    const handleSearch = ( search: any, dataIndex: DataIndex,) => {
        setSearchText(search);
        setSearchedColumn(dataIndex)
        const filteredData = props.data.filter((data: any) =>
            data[dataIndex].toString().toLowerCase().includes(search.toString().toLowerCase()));
        !search ? setDataSource(props.data) : setDataSource(filteredData);
    };
    const handleDelete = async (key: any, record: any) => {
        const newData = dataSource.filter(item => item.key !== key);
        const url = APPS_API.SOFT_DELETE_APP(record.slug)
         await axiosClient.put(url);
        const permittedApps =  await appsApi.getPermittedAll(props.userRole.role);
        dispatch(updatePermittedApps(permittedApps))
        setDataSource(newData);
    };
    function toggleNumber( status: boolean){
        if (status) {
            return 1;
        }else{
            return 0;
        }

    }
    const handlePublishToggle = async  (key:any, record: any) => {
        console.log(record.status, "Status")
        const status = toggleNumber(record.status)
        await appsApi.updateApp(record.slug, status )
         const permittedApps =  await appsApi.getPermittedAll(props.userRole.role);
        dispatch(updatePermittedApps(permittedApps))

        const  data = processTableData(permittedApps, userList);
        setDataSource(data);
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a['name'].length - b['name'].length,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            ...getColumnSearchProps('slug'),
            sorter: (a, b) => a.slug - b.slug,
            sortOrder: sortedInfo.columnKey === 'slug' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.length - b.status.length,
            sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text) => (
                <span>
                    {text ?
                        <Tag color="#198754">Active </Tag>
                        :
                        <Tag color="#cd201f">Inactive  </Tag>
                    }
          </span>
            ),
        },
        {
            title: 'Manager',
            dataIndex: 'manager',
            key: 'manager',
            ...getColumnSearchProps('manager'),
            sorter: (a, b) => a.manager - b.manager,
            sortOrder: sortedInfo.columnKey === 'manager' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Secrets',
            dataIndex: 'secrets',
            key: 'secrets',
            sorter: (a, b) => a.secrets.length - b.secrets.length,
            sortOrder: sortedInfo.columnKey === 'secrets' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text) => (
                <span>
            <Badge status="success" />
                    {text}
          </span>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (_, record: any) =>
                dataSource.length >= 1 ? (
                    <span>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key, record)}>
                            <a className="font-icons"><AiTwotoneDelete /></a>
                        </Popconfirm>
                        <button className="btn" onClick={() => {
                            navigate(`/app/${record.slug}`)
                        }}>
                            <a className="font-icons mx-2"><ImEnter/></a>
                        </button>
                        <Popconfirm title={record.status ? "Sure to deactivate ?" : "Sure to activate ?" } onConfirm={() => handlePublishToggle(record.key, record)}>
                            <a className="font-icons mx-2">
                                                    {record.status ?
                                                        <MdPublishedWithChanges />
                                                        :
                                                        <MdOutlineUnpublished />
                                                    }
                            </a>
                        </Popconfirm>
                    </span>
                ) : null,
        },
    ];

    return(
        <>
            { selectedData ?
                selectedData?.length > 0 ?
                    <div className="mb-3">
                        <span className={"action_title"}>
                            Bulk Action:
                        </span>

                        <span onClick={() => props.handelPin(selectedData)}  className=" action_title ms-3 ">
                            <AiFillPushpin />
                        </span>
                        <span   onClick={() => props.handleDelete(selectedData)} className=" action_title mx-3 ">
                            <AiTwotoneDelete />
                        </span>
                    </div>

                    : null : null
            }
            {dataSource &&
                <DataTable  loading={loading} setSortedInfo={setSortedInfo} dataSource={dataSource} columns={columns} rowSelection={rowSelection}  />
            }
        </>
    )
}