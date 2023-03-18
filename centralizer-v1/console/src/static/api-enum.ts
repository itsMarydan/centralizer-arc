

const AUTH_URL = window?._env_?.REACT_APP_AUTH
    ? window._env_.REACT_APP_AUTH : window?._env_?.REACT_APP_AUTH;
const DUTY_URL = window?._env_?.REACT_APP_DUTY
    ? window._env_.REACT_APP_DUTY : window?._env_?.REACT_APP_DUTY;
const NUB_URL = window?._env_?.REACT_APP_NUB
    ? window._env_.REACT_APP_NUB : window?._env_?.REACT_APP_NUB;
const MANAGER_URL = window?._env_?.REACT_APP_MANAGER
    ? window._env_.REACT_APP_MANAGER : window?._env_?.REACT_APP_MANAGER;


export const BASE_URL = {
    AUTH: AUTH_URL,
    NUB: NUB_URL,
    DUTY: DUTY_URL,
    MANAGER: MANAGER_URL,
}