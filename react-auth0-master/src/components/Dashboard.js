import React, { useState, useEffect } from 'react'
import Loader from './Loader';
import '../css/dashboard.css';
import { Link, Redirect } from "react-router-dom";
import { Api } from "../Configurations/Api";
import { useAuth0 } from "@auth0/auth0-react";

export default function Dashboard() {
    const mqttSubscribeStorageKey = process.env.REACT_APP_MQTT_SUBSCRIBE_LOCAL_STORAGE_KEY;
    const mqttPublishStorageKey = process.env.REACT_APP_MQTT_PUBLISH_LOCAL_STORAGE_KEY;
    const { user, isAuthenticated } = useAuth0();
    const apiUrlData = require('../Configurations/apiUrl.json');

    const [dashboardData, setDashboardData] = useState({
        "onDevices": 0,
        "totalDevices": 0,
        "offDevices": 0,
        "rooms": []
    });
    setInterval(() => {
        let data = JSON.parse(localStorage.getItem(mqttSubscribeStorageKey));
        data = data === undefined || data === null ? [] : data;
        dashboardData.onDevices = 0;
        data.forEach((ele, ind) => {
            if (new Date() - new Date(ele.timeStamp) < 120000) {
                dashboardData.rooms.forEach((roomCol, roomColInd) => {
                    if (roomCol.length > 0) {
                        roomCol.forEach((roomEle, roomInd) => {
                            if (roomEle.deviceKey === ele.deviceId) {
                                roomEle["wifi"] = ele.wifi;
                                roomEle["ip"] = ele.ip;
                                roomEle["status"] = ele.status;
                                if (ele.status.toLowerCase() === 'on') {
                                    dashboardData.onDevices = dashboardData.onDevices + 1;
                                    dashboardData.offDevices = dashboardData.totalDevices - dashboardData.onDevices;
                                }
                            }
                        });
                    }
                });
            }
            // return ele;
        });
        dashboardData.offDevices = dashboardData.onDevices === 0 ? dashboardData.totalDevices : dashboardData.offDevices;
        setDashboardData(dashboardData);
    }, 30000);
    const [loadingData, setLoadingData] = useState(true);
    useEffect(() => {
        Api.Post(apiUrlData.userController.addUser, {
            "Firstname": user.given_name,
            "Lastname": user.family_name,
            "Email": user.email,
            "UserKey": user.sub.split("|")[1],
            "AuthProvidor": user.sub.split("|")[0],
            "Language": user.locale
        });
    }, [loadingData, apiUrlData.Dashboard.getDashboardData]);

    useEffect(() => {
        let _data = {};
        async function getDashboardData() {
            await Api.Get(apiUrlData.Dashboard.getDashboardData).then(res => {
                let resData = res.data;
                _data["onDevices"] = 0;
                _data['devices'] = resData.devices;
                _data["totalDevices"] = resData.devices.length;
                _data["offDevices"] = resData.devices.length;
                _data["rooms"] = [];
                resData.rooms.forEach(element => {
                    _data.rooms.push(resData.devices.filter(ele => {
                        if (ele.roomKey === element.roomKey)
                            return ele;
                    }));
                });
                setDashboardData(_data);
                setLoadingData(false)
                console.table(_data);
            })
        }
        if (loadingData) {
            getDashboardData();
        }
    }, [loadingData, apiUrlData.Dashboard.getDashboardData]);

    const handleTurnOnAllDevice = () => {
        let localData = JSON.parse(localStorage.getItem(mqttPublishStorageKey));
        localData = localData === undefined || localData === null ? [] : localData;
        dashboardData.devices.forEach((ele, ind) => {
            localData.push({
                deviceId: ele.deviceKey,
                power: "On",
                topic: window.iotGlobal.apiKey
            });
        });
        localStorage.setItem(mqttPublishStorageKey, JSON.stringify(localData));
        dashboardData.offDevices=0;
        dashboardData.onDevices=dashboardData.totalDevices;
        setDashboardData(dashboardData);
    };
    return (
        <div className="page-container">
            {!isAuthenticated && (<Redirect to="/"></Redirect>)}
            {loadingData && (<Loader></Loader>)}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                </ol>
            </nav>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                <div className="col mb-3">
                    <div className="card text-black mb-3 h-100" >
                        <div className="card-header bg-success bg-gradient ">Online Device(s)</div>
                        <div className="card-body">
                            <p className="card-text text-center">  <span className="device-count">{dashboardData.onDevices}</span> Out of <span className="device-count">{dashboardData.totalDevices}</span></p>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-success btn-sm" onClick={e => { handleTurnOnAllDevice() }}>Turn On All</button>
                            <button className="btn btn-danger  btn-sm" style={{ marginLeft: 10 + 'px' }}>Turn Off All</button>
                        </div>
                    </div>
                </div>
                <div className="col mb-3">
                    <div className="card text-black mb-3 h-100" >
                        <div className="card-header bg-danger bg-gradient">Offline Device(s)</div>
                        <div className="card-body">
                            <p className="card-text text-center">  <span className="device-count">{dashboardData.offDevices}</span> Out of <span className="device-count">{dashboardData.totalDevices}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            {
                dashboardData.rooms.map((ele, ind) => {
                    if (ele.length === 0)
                        return <div key={ind + "2"}></div>
                    else
                        return <div key={ind + "1"} className="row">
                            <div className="col mb-3">
                                <div className="card text-black">
                                    <div className="card-header bg-primary bg-gradient">
                                        <h5 className="card-title">{ele[0].roomName}</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            {
                                                ele.map((device, index) => {
                                                    return <div key={index} className="col-4">
                                                        <div className="card text-black mb-3 h-100" >
                                                            <div className="card-header bg-danger">{device.deviceName}</div>
                                                            <div className="card-body">
                                                                <ol className="device-desc">
                                                                    <li key={ind + "1"} title="Device ID"><i className="fas fa-server"></i><span>{device.deviceKey}</span></li>
                                                                    <li key={ind + "2"} title="SSID"><i className="fas fa-wifi"></i><span>{device?.wifi}</span></li>
                                                                    <li key={ind + "3"} title="IP Address"><i className="fas fa-network-wired"></i><span>{device?.ip}</span></li>
                                                                    <li key={ind + "4"} title="Power" ><i className="fas fa-power-off"></i><span>{device?.status}</span></li>
                                                                </ol>
                                                            </div>
                                                            <div className="card-footer">
                                                                <button className="btn btn-primary btn-sm">Turn On</button>
                                                                <button className="btn btn-default  btn-sm" style={{ marginLeft: 10 + 'px' }}>Turn Off</button>
                                                                <button className="btn btn-default  btn-sm" style={{ marginLeft: 10 + 'px' }}>Trigger</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                })
            }


        </div>
    )
}
