export const appData = {
    appTableHead: [
        {id: 'appName', numeric: false, disablePadding: true, label: 'Name'},
        {id: 'appSlug', numeric: false, disablePadding: false, label: 'Slug'},
        {id: 'appStatus', numeric: false, disablePadding: false, label: 'Status'},
        {id: 'appManager', numeric: false, disablePadding: false, label: 'Manager'},
        {id: 'appSecrets', numeric: true, disablePadding: false, label: 'Secrets'},
    ]
}

export  const contentsData = {
    contentsTableHead: [
        {id: 'contentName', numeric: false, disablePadding: true, label: 'Name'},
        {id: 'slug', numeric: false, disablePadding: false, label: 'Slug'},
        {id: 'status', numeric: false, disablePadding: false, label: 'Status'},
        {id: 'type', numeric: false, disablePadding: false, label: 'Type'},
        {id: 'fields', numeric: true, disablePadding: false, label: 'Number of Fields'},
    ]
}