export const navData = {
    permissions: [{
        display: "Users",
        link: "/users"
    }, {
        display: "Authorization",
        link: "/authorization"
    }],
    main: [
        {hasChildren: false, display: "Profile", link: "/profile"},
        {hasChildren: false, display: "Plugins", link: "/"},
        {hasChildren: false, display: "Settings", link: "/"},
        {hasChildren: false, display: "System Manager", link: "/system-manager", isSysAdmin: false},
        {hasChildren: false, display: "Logs", link: "/"},
    ]
}