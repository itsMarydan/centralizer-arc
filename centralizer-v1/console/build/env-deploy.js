
const AUTH_URL = window?._env_?.REACT_APP_AUTH
    ? window._env_.REACT_APP_AUTH : window?._env_?.REACT_APP_AUTH;

const DUTY_URL = window?._env_?.REACT_APP_DUTY
    ? window._env_.REACT_APP_DUTY : window?._env_?.REACT_APP_DUTY;
const NUB_URL = window?._env_?.REACT_APP_NUB
    ? window._env_.REACT_APP_NUB : window?._env_?.REACT_APP_NUB;
const MANAGER_URL = window?._env_?.REACT_APP_MANAGER
    ? window._env_.REACT_APP_MANAGER : window?._env_?.REACT_APP_MANAGER;
  


console.log("This is runtime env variable from ENV-DEPLOY.js: ",AUTH_URL, DUTY_URL, NUB_URL, MANAGER_URL );