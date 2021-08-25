import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import Loader from './Loader';
import '../css/dashboard.css';
import { Link, Redirect } from "react-router-dom";
import { Api } from "../Configurations/Api";
import { useAuth0 } from "@auth0/auth0-react";
import * as mqtt from 'react-paho-mqtt';

export default function Dashboard() {
    const { user, isAuthenticated } = useAuth0();
    const apiUrlData = require('../Configurations/apiUrl.json');
    const [client, setClient] = useState(null);
    const _topic = ["Hello"];
    const _options = {};
    const [dashboardData, setDashboardData] = useState({
        "onDevices": 0,
        "totalDevices": 0,
        "offDevices": 0,
        "rooms": []
    });
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
    });
    const _init = () => {
        const c = mqtt.connect("iot.eclipse.org", Number(8000), "/ws", _onConnectionLost, _onMessageArrived); // mqtt.connect(host, port, clientId, _onConnectionLost, _onMessageArrived)
        setClient(c);
        if(client!==null){
        client.connect({
            onSuccess: () => {
                for (var i = 0; i < _topic.length; i++) {
                    client.subscribe(_topic[i], _options);
                    console(_topic[i]);
                }
            }
        });}
    }
    const _sendPayload = () => {
        const payload = mqtt.parsePayload("Hello", "World"); // topic, payload
        client.send(payload);
    }

    // called when client lost connection
    const _onConnectionLost = responseObject => {
        if (responseObject.errorCode !== 0) {
            console.log(responseObject);
        }
    }

    // called when messages arrived
    const _onMessageArrived = message => {
        console.log("onMessageArrived: " + message.payloadString);
    }


    // called when subscribing topic(s)
    const _onSubscribe = () => {
        client.connect({
            onSuccess: () => {
                for (var i = 0; i < _topic.length; i++) {
                    client.subscribe(_topic[i], _options);
                    console(_topic[i]);
                }
            }
        }); // called when the client connects
    }

    // called when subscribing topic(s)
    const _onUnsubscribe = () => {
        for (var i = 0; i < _topic.length; i++) {
            client.unsubscribe(_topic[i], _options);
        }
    }

    // called when disconnecting the client
    const _onDisconnect = () => {
        client.disconnect();
    }
    useEffect(() => {
        
    _init();
        let _data = {};
        async function getDashboardData() {
            await Api.Get(apiUrlData.Dashboard.getDashboardData).then(res => {
                let resData = res.data;
                _data["onDevices"] = resData.devices.length;
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
                setLoadingData(false);
            })
        }
        if (loadingData) {
            getDashboardData();
        }
    }, [loadingData, apiUrlData.Dashboard.getDashboardData,_init]);
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
                            <button className="btn btn-success btn-sm">Turn On All</button>
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
                                                                    <li key={ind + "2"} title="SSID"><i className="fas fa-wifi"></i><span>17066 2.4G</span></li>
                                                                    <li key={ind + "3"} title="IP Address"><i className="fas fa-network-wired"></i><span>172.168.2.43</span></li>
                                                                    <li key={ind + "4"} title="Power" ><i className="fas fa-power-off"></i><span>OFF</span></li>
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
