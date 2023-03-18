import {useDispatch, useSelector} from "react-redux";
import {fetchUserList, selectUserList} from "../../features/user/userSlice";
import React from "react";
import {capitalize} from "../../helper/caseChange";
import {UsersTable} from "./users-table";

interface DataType {
    userId: number,
    email: string,
    role: string,
    isActive: boolean,
    fullName: string,
}
export function UsersBoard(){
    const dispatch = useDispatch();
    const users = useSelector(selectUserList);

    function createData(userId: number, email: string, role: string, isActive: boolean, fullName: string ): DataType{
        return {
            userId,
            email,
            role,
            isActive,
            fullName,
        };
    }

    React.useEffect(() => {
        dispatch(fetchUserList());
    }, [dispatch])

    function generateDate(){
        const rows: DataType[] = [];
        users.forEach((user) => {
            const fullName = capitalize(user.firstName) + ", " + capitalize(user.lastName);
            rows.push(createData(user.userId, user.email, user.role, user.isActive, fullName))
        })
        return rows;
    }

    const data: DataType [] = generateDate();

    return (
        <>
            <UsersTable tableData={data} />
        </>
    )

}