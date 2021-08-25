import axios from "axios";
const apiBaseUrl = process.env.REACT_APP_API_URL;
export const Api = {
    "Post": (url, data) => {
        if (data) {
            return axios.post(apiBaseUrl + url, data, {
                headers: {
                    userkey: window.iotGlobal?.userKey,
                    'Access-Control-Allow-Origin':"*"
                }
            })
        }
        else {
            throw new Error("Pass Data Object");
        }
    },
    "Put": (url, data) => {
        if (data) {
            return axios.put(apiBaseUrl + url, data,{
                headers: {
                    userkey: window.iotGlobal?.userKey,
                    'Access-Control-Allow-Origin':"*"
                }
            })
        }
        else {
            throw new Error("Pass Data Object");
        }
    }, "Delete": (url) => {
        return axios.delete(apiBaseUrl + url,{
            headers: {
                userkey: window.iotGlobal?.userKey,
                'Access-Control-Allow-Origin':"*"
            }
        });
    }, "Get": (url) => {
        return axios.get(apiBaseUrl + url,{
            headers: {
                userkey: window.iotGlobal?.userKey,
                'Access-Control-Allow-Origin':"*"
            }
        });
    }
}
