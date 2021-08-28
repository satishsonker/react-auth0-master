import React, { useState, useEffect } from 'react'
import { Link, Redirect} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
export default function DeviceCreate() {
    toast.configure();
    const { user } = useAuth0();
    const apiUrlData = require('../Configurations/apiUrl.json');
    const [loadingData, setLoadingData] = useState(true);
    const [deviceTypeData, setDeviceTypeData] = useState([]);
    const [roomData, setRoomData] = useState([]);
    const [isDeviceCreated, setIsDeviceCreated] = useState(false);
    const [device, setDevice] = useState({
        "UserKey": user.sub.split("|")[1],
        "DeviceName": '',
        "DeviceDesc": '',
        "DeviceTypeId": '',
        "RoomId": 0
    });
    useEffect(() => {
        async function getRoomData() {
            setLoadingData(true);
            await Api.Get(apiUrlData.deviceController.getDeviceTypeDropdown).then(res => {
                setDeviceTypeData(res.data);
                setLoadingData(false)
            });
            setLoadingData(true);
            await Api.Get(apiUrlData.roomController.getRoomDropdown).then(res => {
                setRoomData(res.data);
                setLoadingData(false);
            })
        }
        if (loadingData) {
            getRoomData();
        }
    }, [loadingData,apiUrlData.deviceController.getDeviceTypeDropdown,apiUrlData.roomController.getRoomDropdown]);
    const inputHandler = (e,dataType) => {
        var val= dataType!==undefined && dataType.toLowerCase()==="int"?Number(e.target.value):e.target.value;
        setDevice({ ...device, [e.target.name]: val });
    };
    const handleSubmit = () => {
        if (device.DeviceName.length < 1) {
            toast.error("Fill device name field.");
            return;
        }
        else if (device.DeviceName.length < 3) {
            toast.error("Device name should be min 3 char");
            return;
        }
        if (device.DeviceTypeId === "") {
            toast.error("Please select device type" );            
            return;
        }
        if (device.RoomKey === "") {
            toast.error("Please select room" );            
            return;
        }
        Api.Post(apiUrlData.deviceController.addDevice, device).then(res => {
            toast.success("Device is created");
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
                    <li className="breadcrumb-item active" aria-current="page">Add Device</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-header bg-primary bg-gradient">
                            <h6 className="card-title">Add Device</h6>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="txtDeviceName" className="form-label">Device Name<strong className="text-danger">*</strong></label>
                                    <input type="text" name="DeviceName" value={device.DeviceName} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceName" aria-describedby="txtDeviceNameHelp" />
                                    <div id="txtDeviceNameHelp" className="form-text">Enter the device name</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtDeviceDesc" className="form-label">Device Description</label>
                                    <textarea name="DeviceDesc" value={device.DeviceDesc} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceDesc" aria-describedby="txtDeviceDescHelp" />
                                    <div id="txtDeviceDescHelp" className="form-text">Enter the desire Device description</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtDeviceType" className="form-label">Device Type</label>
                                    <select name="DeviceTypeId" onChange={e => inputHandler(e,'int')} className="form-control" id="ddlDeviceType" aria-describedby="txtDeviceTypeHelp">
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
                                    <select name="RoomId" onChange={e => inputHandler(e,'int')} className="form-control" id="ddlRoomKey" aria-describedby="ddlRoomKeyHelp">
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

                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">Submit</button>
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
