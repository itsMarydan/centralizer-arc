import React from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchPolicies, selectPolicies,} from "../../features/authorize/authorizeSlice";
import {Policy} from "../../models/rules";
import {PolicyTable} from "./policy-table";

interface DataType {
    policyName: string,
    policyDisplay: string,
    policyId: number,
    description: string,
    rules: string[],
    apps: string[],
}


export function PoliciesBoard(){
    const dispatch = useAppDispatch();
    const policies = useAppSelector(selectPolicies);

    function createData(policyName: string, policyDisplay: string, policyId: number,description: string, rules: string[], apps: string[] ): DataType{
        return {
            policyName,
            policyDisplay,
            description,
            policyId,
            apps,
            rules,
        };
    }
    React.useEffect(() => {
        dispatch(fetchPolicies());
    }, [dispatch]);

    function generateData ( ): DataType[] {
        const Data: any= [];
        policies?.forEach((policy: Policy, key: any) => {
            const created = createData(policy.policyName, policy.policyDisplay, policy.policyId, policy.description, policy.rules, policy.apps);
            Data.push(created)
        })
        return Data;
    }
    const data: DataType[] = generateData();
    return(
        <>
            <PolicyTable tableData={data}/>
        </>
    )
}