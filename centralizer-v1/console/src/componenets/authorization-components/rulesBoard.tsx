import React from "react";
import {fetchBuilder, fetchForms, fetchSchema} from "../../features/forms/formsSlice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchRules, selectRules} from "../../features/authorize/authorizeSlice";
import authorizeApi from "../../api/authorize";
import {Rules} from "../../models/rules";
import {RulesTable} from "./rules-table";

interface DataType {
    ruleName: string;
    description: string,
    ruleId: number,
    isLocked: boolean,
}


export function RulesBoard(){
    const dispatch = useAppDispatch();
    const rules = useAppSelector(selectRules);

    function createData(ruleName: string, description: string, ruleId: number, isLocked: boolean ): DataType{
        return {
            ruleName,
            description,
            ruleId,
            isLocked,
        };
    }
    React.useEffect(() => {
            dispatch(fetchRules());
    }, [dispatch]);

    function generateData ( ): DataType[] {
        const Data: any= [];
        rules?.forEach((rule: Rules, key: any) => {
            const created = createData(rule.ruleName, rule.description, rule.ruleId, rule.isLocked);
            Data.push(created)
        })
        return Data;
    }
    const data: DataType[] = generateData();
    return(
        <>
            <RulesTable tableData={data}/>
        </>
    )
}