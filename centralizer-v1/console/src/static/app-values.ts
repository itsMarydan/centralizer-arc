export const APP_STATUS = {
    ACTIVE: {
        name: 'active',
        value: 0,
        bool: true
    },
    INACTIVE: {
        name: 'in-active',
        value: 1,
        bool: false
    },
}

export const APP_STATUS_VALUES = [
    {
        name: 'active',
        value: 0,
        bool: true
    },
    {
        name: 'in-active',
        value: 1,
        bool: false
    },
]

export function  getAppStatus(value: number): boolean {
    console.log(value)
    const status = APP_STATUS_VALUES.find(status => status.value === value);
    console.log(status);
    return status ? status.bool : false;
}

export const DATA_TYPE = {
    content: 0,
    form: 1
}