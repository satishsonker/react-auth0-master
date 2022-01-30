import { Api } from "./Api";
import { toast } from 'react-toastify';
const mqttSubscribeServerStorageKey = process.env.REACT_APP_MQTT_SUBSCRIBE_SERVER_LOCAL_STORAGE_KEY;
const mqttPublishStorageKey = process.env.REACT_APP_MQTT_PUBLISH_LOCAL_STORAGE_KEY;
const tablePageSize=process.env.REACT_APP_TABLE_PAGE_SIZE===undefined?[10,20,30,40,50,100]:process.env.REACT_APP_TABLE_PAGE_SIZE;
const apiUrlData = require('../Configurations/apiUrl.json');
export const common = {
    getDateTime: (date) => {
       let dateObj;
        if (date === undefined || date === null)
        {
            return '';
        }
        if (typeof(date) === "object")
        {
            dateObj = date;
        }
        if (typeof(date) === "string"){
            dateObj = new Date(date);
        }
        else
        {
            dateObj = new Date();
        }

        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return dateObj.getDate() + "-" + months[dateObj.getMonth()] + "-" + dateObj.getFullYear() + " " + formatAMPM(dateObj);
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
        toast.success('Data copied to clipboard');
    },
    queryParam: (params) => {
        if (params === undefined || params === "" || params === null) {
            return {};
        }
        params = "{\"" +
        decodeURIComponent(params)
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
    },
    getAppName: () => {
        return process.env.REACT_APP_APP_NAME
    },
    getUserRoles: () => {
        return Api.Get(apiUrlData.userController.getUserPermission);
    },
    getCommandObj: (cmdName, val) => {
        cmdName = cmdName.toLowerCase();
        let obj = {
            action: '',
            value: {}
        }
        if (cmdName === 'on' || cmdName === 'off') {
            obj.action = 'action.devices.commands.OnOff';
            obj.value = {
                on: cmdName === 'on' ? "true" : "false"
            }
        }
        else if (cmdName === 'press') {
            obj.action = 'action.devices.commands.Press';
            obj.value = "press";
        }
        else if (cmdName === 'brightness') {
            obj.action = 'action.devices.commands.BrightnessAbsolute'
            obj.value = {
                brightness: val * 2.55
            }
        }
        else if (cmdName === 'timer') {
            obj.action = 'action.devices.commands.TimerAbsolute'
            obj.value = {
                timer: val
            }
        }
        else if (cmdName === 'saturation') {
            obj.action = 'action.devices.commands.SaturationAbsolute';
            obj.value = {
                saturation: val
            }
        }
        else if (cmdName === 'color') {
            obj.action = 'action.devices.commands.ColorAbsolute';
            obj.value = {
                color: {
                    spectrumRGB: val
                }
            }
        }
        return obj;
    },
    getApiKey: () => {
        return window.iotGlobal.apiKey;
    },
    cloneObject: (obj) => {
        if (typeof (obj) === 'object') {
            return JSON.parse(JSON.stringify(obj));
        }
        throw Error('unable to clone the object');
    },
    dataType: {
        string: 'string',
        number: 'number',
        float: 'float',
        int: 'int',
        bool: 'bool',
        object: 'object',
        array: 'array',
        arrayObject: 'arrayObject'
    },
    getDefault: (type) => {
        let params;
        switch (type) {
            case undefined:
                params = ''
                break;
            case null:
                params = '';
                break;
            case common.dataType.string:
                params = "";
                break;
            case common.dataType.number:
                params = 0;
                break;
            case common.dataType.float:
                params = 0.0;
                break;
            case common.dataType.int:
                params = 0;
                break;
            case common.dataType.bool:
                params = false;
                break;
            case common.dataType.object:
                params = {};
                break;
            case common.dataType.array:
                params = [];
                break;
            case common.dataType.arrayObject:
                params = [{}];
                break;
            default:
                params = '';
                break;
        }
        return params;
    },
    getDefaultIfEmpty: (params,replaceValue) => {
        if (!common.hasValue(params) || params.indexOf('undefined')>-1 || params.indexOf('null')>-1 || params.replace(/ /g,'')==='')
            return common.hasValue(replaceValue)?replaceValue:'';
        return params;
    },
    defaultIfEmpty:(input,defaultValue)=>{
        if(!common.hasValue(input) || input === {} || input === "")
        return defaultValue;
        return input;
    },
    generateClientId:()=>{
        return `AreanaIoT_${Math.random().toString(16).substr(2, 8)}_${Math.random().toString(16).substr(2, 8)}`
    },
    toastMsg:{
        error:"Something went wrong. Please try later.",
        update:"`${msg} updated successfully`"
    },
    deviceType:{
        gasSensor:"gas sensor",
        ultrasonicSensor:"ultrasonic sensor",
        light:"light",
        switch:"switch",
        doorbell:"doorbell",
        motionSensor:"motion sensor",
        lock:"lock",
        ldrSensor:'ldr sensor',
        waterSensor:'water sensor',
        soundSensor:'sound sensor',
        temperatureSensor:'temperature sensor',
        humiditySensor:'humidity sensor',
        moistureSensor:'moisture sensor',
        soundSensor:'sound sensor'
    },
    getValueFromObject:function(st, obj) {
        if(typeof(st)!=='string')
        return '';
        return st.replace(/\[([^\]]+)]/g, '.$1').split('.').reduce(function(o, p) { 
            return o[p];
        }, obj);
    },
    getTablePageSize:function()
    {
        if(typeof tablePageSize ==='string')
        return JSON.parse(tablePageSize);
        return tablePageSize;
    },
    customCellType:{
        cell:'cell',
        button:'button',
        text:'text',
        image:'image'
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
