import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {AUTH_TOKEN} from "../../static/token";

interface LoginData {
    email: string;
    password: string;
}

const checkCookieAndRedirect = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const intervalId = setInterval(() => {
            const cookie = Cookies.get(AUTH_TOKEN);
            if (cookie) {
                clearInterval(intervalId);
                navigate("/");
            }
        }, 500);

        return () => clearInterval(intervalId);
    }, [navigate]);

    // Perform login logic here and set the cookie if login is successful

};

export default checkCookieAndRedirect;