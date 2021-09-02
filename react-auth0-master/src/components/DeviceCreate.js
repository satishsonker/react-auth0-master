import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import {common  } from "../Configurations/common";
export default function DeviceCreate() {
    toast.configure();
    const { user } = useAuth0();
    const apiUrlData = require('../Configurations/apiUrl.json');
    const [loadingData, setLoadingData] = useState(true);
    const [isDeviceUpdate, setIsDeviceUpdate] = useState(false);
    const [deviceTypeData, setDeviceTypeData] = useState([]);
    const [roomData, setRoomData] = useState([]);
    const [isDeviceCreated, setIsDeviceCreated] = useState(false);
    
    const [device, setDevice] = useState({
        "UserKey": user.sub.split("|")[1]
    });
    useEffect(() => {
        let deviceKey = common.queryParam(window.location.search)?.id;
        deviceKey = deviceKey === undefined || deviceKey === null ? '' : deviceKey;
        async function getRoomData() {
            setLoadingData(true);
            let [deviceTypeResponse, roomResponse] = await Promise.all([
                Api.Get(apiUrlData.deviceController.getDeviceTypeDropdown),
                Api.Get(apiUrlData.roomController.getRoomDropdown)]);
                setDeviceTypeData(deviceTypeResponse.data);
                setRoomData(roomResponse.data);
            if (deviceKey !== "") {
                setIsDeviceUpdate(true);
                await Api.Get(apiUrlData.deviceController.getAllDevice + "?devicekey=" + deviceKey).then(res => {
                    setDevice(res.data[0]);
                    setLoadingData(false);
                });
            }
            else
            setLoadingData(false);
        }
        if (loadingData) {
            getRoomData();
        }
    }, [apiUrlData.deviceController.getAllDevice,apiUrlData.deviceController.getDeviceTypeDropdown,apiUrlData.roomController.getRoomDropdown,loadingData]);
    const inputHandler = (e, dataType) => {
        var val = dataType !== undefined && dataType.toLowerCase() === "int" ? Number(e.target.value) : e.target.value;
        setDevice({ ...device, [e.target.name]: val });
    };
    const handleSubmit = () => {
        if (device.deviceName.length < 1) {
            toast.error("Fill device name field.");
            return;
        }
        else if (device.deviceName.length < 3) {
            toast.error("Device name should be min 3 char");
            return;
        }
        if (device.deviceTypeId === "") {
            toast.error("Please select device type");
            return;
        }
        if (device.roomKey === "") {
            toast.error("Please select room");
            return;
        }
        Api.Post(isDeviceUpdate?apiUrlData.deviceController.updateDevice: apiUrlData.deviceController.addDevice, device).then(res => {
            toast.success(!isDeviceUpdate?"Device is created":" Device is updated");
            setIsDeviceCreated(true);
        }).catch(ee => {
            toast.error("Something went wrong !");
        });
    }
    return (
        <div className="page-container">
            {loadingData && (<Loader></Loader>)}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/Device">Device</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{!isDeviceUpdate?'Add ':'Update '} Device</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-header bg-primary bg-gradient">
                            <h6 className="card-title">{!isDeviceUpdate?'Add ':'Update '} Device</h6>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="txtDeviceName" className="form-label">Device Name<strong className="text-danger">*</strong></label>
                                    <input type="text" name="deviceName" value={device.deviceName} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceName" aria-describedby="txtDeviceNameHelp" />
                                    <div id="txtDeviceNameHelp" className="form-text">Enter the device name</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtDeviceDesc" className="form-label">Device Description</label>
                                    <textarea name="deviceDesc" value={device.deviceDesc} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceDesc" aria-describedby="txtDeviceDescHelp" />
                                    <div id="txtDeviceDescHelp" className="form-text">Enter the desire Device description</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtDeviceType" className="form-label">Device Type</label>
                                    <select name="deviceTypeId" value={device.deviceTypeId} onChange={e => inputHandler(e, 'int')} className="form-control" id="ddlDeviceType" aria-describedby="txtDeviceTypeHelp">
                                        <option value="">Select Device Type</option>
                                        {
                                            deviceTypeData && (deviceTypeData.map((ele, ind) => {
                                                return (
                                                    <option value={ele.deviceTypeId} key={ele.deviceTypeId}>{ele.deviceTypeName}</option>
                                                )
                                            }))
                                        }
                                    </select>
                                    <div id="txtDeviceTypeHelp" className="form-text">Select device type</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtRoomKey" className="form-label">Room Name</label>
                                    <select name="roomId" value={device.roomId} onChange={e => inputHandler(e, 'int')} className="form-control" id="ddlRoomKey" aria-describedby="ddlRoomKeyHelp">
                                        <option value="">Select Room</option>
                                        {
                                            roomData && (roomData.map((ele, ind) => {
                                                return (
                                                    <option value={ele.roomId} key={ele.roomId}>{ele.roomName}</option>
                                                )
                                            }))
                                        }
                                    </select>
                                    <div id="ddlRoomKeyHelp" className="form-text">Select room name</div>

                                </div>

                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isDeviceUpdate?'Add ':'Update '} Device </button>
                                {isDeviceCreated && (
                                    <Redirect to="/Device"></Redirect>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
