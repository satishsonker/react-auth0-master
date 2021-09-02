const mqttSubscribeServerStorageKey = process.env.REACT_APP_MQTT_SUBSCRIBE_SERVER_LOCAL_STORAGE_KEY;
const mqttPublishStorageKey = process.env.REACT_APP_MQTT_PUBLISH_LOCAL_STORAGE_KEY;
export const common = {
    getDateTime: (date) => {
        let dateObj;
        if (date === undefined || date === null)
            dateObj = new Date();
        else if (typeof (date) === "object")
            dateObj = date;
        else if (typeof (data) === "string")
            dateObj = new Date(date);
        else
            dateObj = new Date()

        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return dateObj.getDay() + "-" + months[dateObj.getMonth()] + "-" + dateObj.getFullYear() + " " + formatAMPM(dateObj);
    },
    hasValue: (input) => {
        return input === undefined || input === null ? false : true;
    },
    copyToClipboard: (val) => {
        const el = document.createElement('textarea');
        el.value = val;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    },
    queryParam: (params) => {
        if (params === undefined || params === "" || params === null) {
            return {};
        }
        params = "{\"" +
            params
                .replace(/\?/gi, "")
                .replace(/&/gi, "\",\"")
                .replace(/=/gi, "\":\"") +
            "\"}";

        params = JSON.parse(params);
        return params
    },
    getStorePubData: () => {
        return JSON.parse(localStorage.getItem(mqttPublishStorageKey));
    },
    setStorePubData: (data) => {
        localStorage.setItem(mqttPublishStorageKey, JSON.stringify(data));
    },
    getStoreSubServerData: () => {
        return JSON.parse(localStorage.getItem(mqttSubscribeServerStorageKey));
    },
    setStoreSubServerData: (data) => {
        localStorage.setItem(mqttSubscribeServerStorageKey, JSON.stringify(data));
    }
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}