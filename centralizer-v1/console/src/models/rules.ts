export interface Rules{
    ruleId: number;
    ruleName:string
    description:string
    actions: [],
    isLocked: boolean;
}

export interface Policy {
    policyName: string,
    policyDisplay: string,
    policyId: number,
    description: string,
    rules: string[],
    apps: string[],
}

export interface Roles {
    roleName: string,
    roleDisplay: string,
    roleId: number,
    role: string,
    policies: number[],
    roleType: string,
}