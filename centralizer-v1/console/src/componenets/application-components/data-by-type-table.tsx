import React, {useRef, useState} from "react";
import {ColumnsType, SorterResult} from "antd/es/table/interface";
import {useNavigate} from "react-router-dom";
import {ColumnType} from "antd/es/table";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import DataTable from "../global/custom_table";
import {ImEnter} from "react-icons/im";
import {Badge, Input, InputRef, Popconfirm, Tag} from "antd";
import {DATA_TYPE} from "../../static/app-values";
import {IoHammerSharp} from "react-icons/io5";

interface Props {
    data: DataType[],
    appSlug: string,
    userRole: string,
    dataType: number
}

interface DataType {
    key: string;
    name: any,
    slug: any,
    type: any
    status: boolean,
    fieldsCount: any
}

type DataIndex = keyof DataType;

export function DataByTypeTable(props: Props) {
    const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
    const [dataSource, setDataSource] = useState<DataType[]>(props.data);
    const navigate = useNavigate();
    React.useEffect(() => {
        setDataSource(props.data)
    }, [props.data])
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, setLoading] = React.useState(props.data ? false : true);
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (search: any, dataIndex: DataIndex,) => {
        setSearchText(search);
        setSearchedColumn(dataIndex)
        const filteredData = props.data.filter((data: any) =>
            data[dataIndex].toString().toLowerCase().includes(search.toString().toLowerCase()));
        !search ? setDataSource(props.data) : setDataSource(filteredData);
    };


    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: () => (
            <div style={{padding: 8}}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    onChange={e => handleSearch(e.target.value, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>
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
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
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
            sortOrder: sortedInfo.columnKey === 'identifier' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            sorter: (a, b) => a.slug - b.slug,
            ...getColumnSearchProps('slug'),
            sortOrder: sortedInfo.columnKey === 'slug' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            ...getColumnSearchProps('type'),
            sorter: (a, b) => a.type.length - b.type.length,
            sortOrder: sortedInfo.columnKey === 'type' ? sortedInfo.order : null,
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
            title: 'Fields Count',
            dataIndex: 'fieldsCount',
            key: 'fieldsCount',
            sorter: (a, b) => a.fieldsCount.length - b.fieldsCount.length,
            sortOrder: sortedInfo.columnKey === 'fieldsCount' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text) => (
                <span>
            <Badge status="success"/>
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
                        {record.status ?
                            <button className={"btn"} onClick={() => {
                                navigate(`/app/${props.appSlug}/${props.dataType === DATA_TYPE.content
                                    ? "content" : props.dataType === DATA_TYPE.form ? "form" : "content"}/${record.slug}`);
                            }
                            }>
                                <a className="font-icons mx-2"><ImEnter/></a>
                            </button>
                            :
                            <button onClick={(e) => {
                                e.preventDefault();
                                navigate(`/app/${props.appSlug}/build-${props.dataType === DATA_TYPE.content
                                    ? "content" : props.dataType === DATA_TYPE.form ? "form" : "content"}/${record.slug}`);
                            }} className="btn">
                                <IoHammerSharp />
                            </button>
                        }

                    </span>
                ) : null,
        },
    ];


    return (
        <>
            {dataSource &&
                <DataTable loading={loading} setSortedInfo={setSortedInfo}
                           dataSource={dataSource} columns={columns}/>
            }
        </>
    )
}