export {};

declare global {
    interface Window {
        _env_: any;
        __RUNTIME_CONFIG__: {
            NODE_ENV: string;
            REACT_APP_AUTH: string;
            REACT_APP_NUB: string;
            REACT_APP_DUTY: string;
        };
    }
}