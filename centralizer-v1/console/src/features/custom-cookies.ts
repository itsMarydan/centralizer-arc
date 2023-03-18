import Cookies from "js-cookie";

function setCookie(key: string, value: any) {
    Cookies.set(key, value, { expires: 7 });
}

export default setCookie;