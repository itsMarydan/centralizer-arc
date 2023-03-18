import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from 'js-cookie'

const auth_token = Cookies.get('auth_token');
const axiosClient =  axios.create({
  headers: {
    'Content-Type': 'application/json',
    'authorization': auth_token ? auth_token : ''
  }
});

// Interceptors
axiosClient.interceptors.request.use(function (config: AxiosRequestConfig) {
  // Do something before request is sent
  return config;
}, function (error: any) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axiosClient.interceptors.response.use(function (response: AxiosResponse) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data;
}, function (error: any) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export default axiosClient;