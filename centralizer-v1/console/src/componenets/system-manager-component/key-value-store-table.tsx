import React from "react";
import {Input, InputRef, Table} from "antd";
import {ColumnType} from "antd/es/table";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {ColumnsType} from "antd/es/table/interface";
import {capitalize} from "../../helper/caseChange";
import {MdModeEditOutline} from "react-icons/md";
import {AiFillEye, AiTwotoneDelete} from "react-icons/ai";

interface DataType {
    key: string,
    value: string,
}
interface Props{
    tableData: DataType[],
}
type DataIndex = keyof DataType;
export function KeyValueStoreTable(props: Props){
    const [dataSource, setDataSource] = React.useState<DataType[]>(props.tableData);
    React.useEffect(() => {
        setDataSource(props.tableData)
    }, [props.tableData])
    const [searchText, setSearchText] = React.useState('');
    const [searchedColumn, setSearchedColumn] = React.useState('');
    const [loading, ] = React.useState(false);
    const searchInput = React.useRef<InputRef>(null);

    const [reveal, setReveal] = React.useState("");

    const handleSearch = ( search: any, dataIndex: DataIndex,) => {
        setSearchText(search);
        setSearchedColumn(dataIndex)
        const filteredData = props.tableData.filter((data: any) =>
            data[dataIndex].toString().toLowerCase().includes(search.toString().toLowerCase()));
        !search ? setDataSource(props.tableData) : setDataSource(filteredData);
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
            title: capitalize("Key"),
            dataIndex: 'key',
            key: 'key',
            ...getColumnSearchProps('key'),
        },
        {
            title: capitalize("Value"),
            dataIndex: 'value',
            key: 'value',
            render: (text: any, record: any) =>{
                return(
                    <input
                        type={ reveal == record.key ? "text" : "password"}
                        value={text}
                        disabled={true}
                        className="form-control"
                    />

                )
            }
        },
        {
            title: 'Reveal',
            dataIndex: 'reveal',
            key: 'reveal',
            render: (text: any, record: any) =>{
                return(
                    <span>
                        <a onClick={() => (setReveal(record.key))}><AiFillEye /></a>
                    </span>

                )
            }
        }
    ];

    return (
        <>
            <div>
                {dataSource &&
                    <Table columns={columns} rowKey={"key"} pagination={{ pageSize: 50 }} dataSource={dataSource} size="middle"  bordered={false} />
                }
            </div>
        </>
    )
}