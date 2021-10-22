import React, { useState, useEffect } from 'react'
import Loader from '../Loader';
import '../../css/dashboard.css';
import { Link, Redirect } from "react-router-dom";
import { Api } from "../../Configurations/Api";
import { common } from "../../Configurations/common";
import { useAuth0 } from "@auth0/auth0-react";
import DeviceCard from './DeviceCard';

export default function Dashboard({ userRole, mqttPayload, setPubMsg }) {
    //const mqttSubscribeStorageKey = process.env.REACT_APP_MQTT_SUBSCRIBE_LOCAL_STORAGE_KEY;
    const { isAuthenticated } = useAuth0();
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [dashboardData, setDashboardData] = useState();
    const [messages, setMessages] = useState([]);
    const [dashBoardStatus, setDashBoardStatus] = useState({
        totalDevice: 0,
        connected: 0,
        onDevices: 0
    });
    const [connectedDeviceId, setConnectedDeviceId] = useState(common.getDefault(common.dataType.array));
    useEffect(() => {
        if (mqttPayload?.topic) {
            setMessages([JSON.parse(mqttPayload.message.replace(/'/g, '"').replace(',]', ']'))]);
        }
    }, [mqttPayload]);
    useEffect(() => {
        if (messages.length > 0 && dashboardData?.rooms.length > 0) {
            messages.forEach((ele, ind) => {
                dashboardData.rooms.forEach((roomCol, roomColInd) => {
                    if (roomCol.length > 0) {
                        roomCol.forEach((roomEle, roomInd) => {
                            if (ele.devices?.indexOf(roomEle.deviceKey) > -1) {
                                let _connectedDeviceId = connectedDeviceId;
                                updateDeviceHistory(roomEle.deviceKey);
                                if (connectedDeviceId.indexOf(roomEle.deviceKey) === -1) {
                                    _connectedDeviceId.push(roomEle.deviceKey);
                                    setConnectedDeviceId(_connectedDeviceId);
                                    setDashBoardStatus({ ...dashBoardStatus, ["connected"]: common.defaultIfEmpty(dashBoardStatus.connected, 0) + 1 });
                                }
                                roomEle["wifi"] = ele.wifi;
                                roomEle["ip"] = ele.ip;
                                if (ele.status !== "" || !common.hasValue(roomEle["status"]))
                                    roomEle["status"] = ele.status;
                                if (ele.status.toLowerCase() === 'on') {
                                    setDashBoardStatus({ ...dashBoardStatus, ["onDevices"]: common.defaultIfEmpty(dashBoardStatus.onDevices, 0) + 1 });
                                }
                                else if (ele.status.toLowerCase() === 'off') {
                                    setDashBoardStatus({ ...dashBoardStatus, ["onDevices"]: common.defaultIfEmpty(dashBoardStatus.onDevices, 0) - 1 });
                                }
                            }
                        });
                    }
                });
            });
            // dashboardData.offDevices = dashboardData.onDevices === 0 ? dashboardData.totalDevices : dashboardData.offDevices;
            if (dashboardData.rooms.length > 0) {
                setDashboardData({ ...dashboardData });
                common.setStoreSubServerData([]);
            }
        }
    }, [messages])
    function OnDeviceCounter(params) {
        var data = {
            online: 0,
            on: 0
        }
        if (params) {
            params.forEach((ele, ind) => {
                if (ele?.ip) {
                    data.online += 1;
                }
                if (ele?.status) {
                    data.on += 1;
                }
            });
        }
        return data;
    }
    function updateDeviceHistory(dkey) {
        Api.Post(apiUrlData.deviceController.updateDeviceHistory + "?deviceKey=" + dkey + "&isconnected=true", {});
    }
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        let _data = {};
        async function getDashboardData() {
            await Api.Get(apiUrlData.dashboardController.getDashboardData).then(res => {
                let resData = res.data;
                _data['devices'] = resData.devices;
                _data["rooms"] = [];
                resData.rooms.forEach(element => {
                    return _data.rooms.push(resData.devices.filter(ele => {
                        if (ele.roomKey === element.roomKey)
                            return ele;
                    }));
                });
                setDashBoardStatus({ ...dashBoardStatus, ["totalDevice"]: resData.devices.length });
                setDashboardData(_data);
                setLoadingData(false);
                sendPingRequest();
            })
        }
        if (loadingData) {
            getDashboardData();
        }
    }, [loadingData, apiUrlData.dashboardController.getDashboardData]);

    const handleTurnOnOffDeviceAll = (isOn) => {
        connectedDeviceId.map(ele => {
            handleTurnOnOffDevice(isOn, ele);
        });
    }
    const handleTurnOnOffDevice = (isON, deviceKey) => {
        let value = !isON ? 'ON' : 'OFF';
        setPubMsg({
            deviceId: deviceKey,
            action: common.getCommandObj(value).action,
            topic: common.getApiKey(),
            value: common.getCommandObj(value).value,
        });
    };

    const sendPingRequest = () => {
        setPubMsg({action:"ping"});
    }

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
                        <div className="card-header bg-success bg-gradient ">Connected Device(s)</div>
                        <div className="card-body">
                            <p className="card-text text-center">  <span className="device-count">{dashBoardStatus.connected}</span> Out of <span className="device-count">{dashBoardStatus.totalDevice}</span></p>
                        </div>
                    </div>
                </div>
                <div className="col mb-3">
                    <div className="card text-black mb-3 h-100" >
                        <div className="card-header bg-danger bg-gradient">Offline Device(s)</div>
                        <div className="card-body">
                            <p className="card-text text-center">  <span className="device-count">{dashBoardStatus.totalDevice - dashBoardStatus.connected}</span> Out of <span className="device-count">{dashBoardStatus.totalDevice}</span></p>
                        </div>
                    </div>
                </div>
                <div className="col mb-3">
                    <div className="card text-black mb-3 h-100" >
                        <div className="card-header bg-success bg-gradient ">ON Device(s)</div>
                        <div className="card-body">
                            <p className="card-text text-center">  <span className="device-count">{dashBoardStatus.onDevices}</span> Out of <span className="device-count">{dashBoardStatus.connected}</span></p>
                        </div>
                        {
                            dashBoardStatus.connected === 0 ? '' : <div className="card-footer">
                                <button disabled={dashBoardStatus.connected - dashBoardStatus.onDevices === 0 ? true : false} className="btn btn-success btn-sm" onClick={e => { handleTurnOnOffDeviceAll(true) }}>Turn On All</button>
                                <button disabled={dashBoardStatus.connected - dashBoardStatus.onDevices > 0 ? true : false} className="btn btn-danger  btn-sm" onClick={e => { handleTurnOnOffDeviceAll(false) }} style={{ marginLeft: 10 + 'px' }}>Turn Off All</button>
                            </div>
                        }
                    </div>
                </div>

            </div>
            <div className="row">

                <div className="accordion" id="accordionExample">
                    {
                        dashboardData?.rooms.map((ele, ind) => {
                            if (ele.length === 0)
                                return <div key={ind + "2"}></div>
                            else {
                                return <>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id={"heading" + ind}>
                                            <button className="accordion-button bg-primary" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + ind} aria-expanded="true" aria-controls={"collapse" + ind}>
                                                {
                                                    ele[0].roomName + " - " + ele.length + " Device(s) - " + OnDeviceCounter(ele).online + " Online - " + OnDeviceCounter(ele).on + " Turn On"
                                                }
                                            </button>
                                        </h2>
                                        <div id={"collapse" + ind} className={"accordion-collapse collapse" + (ind === 0 ? 'show' : '')} aria-labelledby={"heading" + ind} data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                <div className="row">
                                                    {
                                                        ele.map((device, index) => {
                                                            return <DeviceCard deviceData={device} index={index} setPubMessage={setPubMsg} devicePowerHandler={handleTurnOnOffDevice}></DeviceCard>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        })
                    }
                </div>
            </div>
        </div>
    )
}
