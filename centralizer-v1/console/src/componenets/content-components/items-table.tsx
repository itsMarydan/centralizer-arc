import DataTable from "../global/custom_table";
import {ColumnsType, SorterResult} from "antd/es/table/interface";
import React, {useRef, useState} from "react";
import {Badge, Input, InputRef, Popconfirm, Tag} from "antd";
import {capitalize} from "../../helper/caseChange";
import {ColumnType} from "antd/es/table";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {time_ago} from "../../helper/timeHelper";
import {AiFillEdit, AiTwotoneDelete} from "react-icons/ai";
import {MdOutlineUnpublished, MdPublishedWithChanges} from "react-icons/md";
import contentsApi from "../../api/contentsApi";
import {useAppDispatch} from "../../app/hooks";
import { fetchContentsSuccess} from "../../features/contents/contentsSlice";
import {useNavigate} from "react-router-dom";

interface Props{
    identifier: any,
    data: [],
    tableData: DataType[],
    appSlug: string,
    contentSlug: string,
    userRole: string
}
interface DataType {
    key: string;
    identifier: any,
    createdOn: any,
    createdBy: any
    status: boolean,
    lastModified: any
}
type DataIndex = keyof DataType;
export function ItemsTable(props: Props){

    const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
    const [dataSource, setDataSource] = useState<DataType[]>(props.tableData);
    const [selectedData, setSelectedData] = useState<DataType[]>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        setDataSource(props.tableData)
    }, [props.tableData])
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, ] = React.useState(false);
    const searchInput = useRef<InputRef>(null);
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedData(selectedRows);
        },
    };
    const handleSearch = ( search: any, dataIndex: DataIndex,) => {
        setSearchText(search);
        setSearchedColumn(dataIndex)
        const filteredData = props.tableData.filter((data: any) =>
            data[dataIndex].toString().toLowerCase().includes(search.toString().toLowerCase()));
        !search ? setDataSource(props.tableData) : setDataSource(filteredData);
    };
    const handleDelete = async (key: any, record: any) => {
        const newData = dataSource.filter(item => item.key !== key);
        await contentsApi.deleteContentItem(props.appSlug, props.contentSlug, props.userRole, record.identifier);
        setDataSource(newData);
    };

    const handlePublishToggle = async  (key:any, record: any) => {
       const updates = {bcPublish: !record.status}
        await contentsApi.updateContentItem(props.appSlug, props.contentSlug, props.userRole, record.identifier,updates)
        const response = await contentsApi.getAllContentBySlug(props.appSlug,props.contentSlug, props.userRole);
        dispatch(fetchContentsSuccess(response))
        setDataSource(dataSource);
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
            title: capitalize(props.identifier),
            dataIndex: 'identifier',
            key: 'identifier',
            ...getColumnSearchProps('identifier'),
            sorter: (a, b) => a['identifier'].length - b['identifier'].length,
            sortOrder: sortedInfo.columnKey === 'identifier' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Created On',
            dataIndex: 'createdOn',
            key: 'createdOn',
            sorter: (a, b) => a.createdOn - b.createdOn,
            sortOrder: sortedInfo.columnKey === 'createdOn' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text) => (
                <span>
            <Badge status="success" />
                    {time_ago(text)}
          </span>
            ),
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
            ...getColumnSearchProps('createdBy'),
            sorter: (a, b) => a.createdBy.length - b.createdBy.length,
            sortOrder: sortedInfo.columnKey === 'createdBy' ? sortedInfo.order : null,
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
                        <Tag color="#198754">Published</Tag>
                        :
                        <Tag color="#cd201f">Unpublished</Tag>
                    }
          </span>
            ),
        },
        {
            title: 'Last Updated',
            dataIndex: 'lastModified',
            key: 'lastModified',
            sorter: (a, b) => a.lastModified.length - b.lastModified.length,
            sortOrder: sortedInfo.columnKey === 'lastModified' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text) => (
                <span>
            <Badge status="success" />
                    {time_ago(text)}
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
                        <button  className={"btn"} onClick={() =>
                            navigate(`/app/${props.appSlug}/edit-content/${props.contentSlug}/${record.identifier}`)
                        }>
                            <a className="font-icons mx-2"><AiFillEdit /></a>
                        </button>
                        <Popconfirm title={record.status ? "Sure to unpublish ?" : "Sure to publish ?" } onConfirm={() => handlePublishToggle(record.key, record)}>
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
                <div>Bulk Actions:
                    <span>
                        <Popconfirm title={`Sure to delete ${selectedData.length} item(s) ?`} onConfirm={() => (console.log(selectedData))}>
                            <a className="font-icons ms-3"><AiTwotoneDelete /></a>
                        </Popconfirm>
                        <Popconfirm title={`Sure to publish ${selectedData.length} item(s) ?`} onConfirm={() => (console.log(selectedData))}>
                            <a className="font-icons mx-2"><MdPublishedWithChanges /></a>
                        </Popconfirm>
                        <Popconfirm title={`Sure to un-publish ${selectedData.length} item(s) ?`} onConfirm={() => (console.log(selectedData))}>
                            <a className="font-icons"><MdOutlineUnpublished /></a>
                        </Popconfirm>
                    </span>
                </div>
                : null
            }
            {dataSource &&
                <DataTable loading={loading} setSortedInfo={setSortedInfo} dataSource={dataSource} columns={columns} rowSelection={rowSelection}  />
            }
        </>
    )
}