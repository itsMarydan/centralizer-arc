export const initialData = {
    columns: {
        'column-1': {
            id: 'column-1',
            title: "To do",
            taskIds: ['task-1','task-2','task-3','task-4']
        },
        'column-2': {
            id: 'column-2',
            title: "In Progress",
            taskIds: []
        },
        'column-3': {
            id: 'column-3',
            title: "Done",
            taskIds: []
        },
    },
    columnOrder: ['column-1', 'column-2', 'column-3']
}



export const userOptions = {
    pinnedApps: {
        'bes-xryugdt': {
            appName: "Test",
            appSlug: "bes-xryugdt",
            appId: "tes",
            appStatus: "active",
            appSecrets: [].length,
            createdBy: "system",
            appManager: 10011,
            contentCount: 12,
            formCount: 11,
            fileCount: 35
        },
        "fus-xryugdt": {
            appName: "Test",
            appSlug: "fus-xryugdt",
            appId: "tes",
            appStatus: "active",
            appSecrets: [].length,
            createdBy: "system",
            appManager: 10011,
            contentCount: 12,
            formCount: 11,
            fileCount: 35
        },
        "tes-xryugdt": {
            appName: "Test",
            appSlug: "tes-xryugdt",
            appId: "tes",
            appStatus: "active",
            appSecrets: [].length,
            createdBy: "system",
            appManager: 10011,
            contentCount: 12,
            formCount: 11,
            fileCount: 35
        }
    },
    appOrder: [ 'bes-xryugdt', 'fus-xryugdt',   'tes-xryugdt']
}