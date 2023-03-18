import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {fetchKeyValueList, selectKeyValueStore} from "../../features/key-value/keyValueSlice";
import {KeyValueStoreTable} from "./key-value-store-table";

interface DataType {
    key: string,
    value: string,
}

export function KeyValueStoreBoard() {
    const dispatch = useDispatch();
    const keyValueStore = useSelector(selectKeyValueStore);

    function createData(key: string, value: string): DataType {
        return {
            key, value
        };
    }

    React.useEffect(() => {
        dispatch(fetchKeyValueList());
    }, [dispatch])

    function generateDate() {
        const rows: DataType[] = [];
        keyValueStore.forEach((keyValuePair) => {
            rows.push(createData(keyValuePair.key, keyValuePair.value))
        })
        return rows;
    }

    const data: DataType [] = generateDate();

    return (
        <>
            <KeyValueStoreTable tableData={data}/>
        </>
    )

}