import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import { common } from "../Configurations/common";
import Unauthorized from './CustomView/Unauthorized';
export default function DeviceCreate({ userRole }) {
    toast.configure();
    const { user } = useAuth0();
    const apiUrlData = require('../Configurations/apiUrl.json');
    const [loadingData, setLoadingData] = useState(true);
    const [isDeviceUpdate, setIsDeviceUpdate] = useState(false);
    const [deviceTypeData, setDeviceTypeData] = useState([]);
    const [roomData, setRoomData] = useState([]);
    const [isDeviceCreated, setIsDeviceCreated] = useState(false);

    const [device, setDevice] = useState({
        "manufacturerName": process.env.REACT_APP_MANUFACTURER_NAME
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
                    res.data[0].friendlyName = res.data[0].deviceName;
                    setDevice(res.data[0]);
                    setLoadingData(false);
                }).catch(err => {
                    setLoadingData(false);
                    toast.error(common.toastMsg.error);
                });
            }
            else
                setLoadingData(false);
        }
        if (loadingData) {
            getRoomData();
        }
    }, [apiUrlData.deviceController.getAllDevice, apiUrlData.deviceController.getDeviceTypeDropdown, apiUrlData.roomController.getRoomDropdown, loadingData]);
    const inputHandler = (e, dataType) => {
        var val = dataType !== undefined && dataType.toLowerCase() === "int" ? Number(e.target.value) : e.target.value;
        setDevice({ ...device, [e.target.name]: val });
    };
    const handleSubmit = () => {
        debugger;
        if (!device)
            return;
        if (device.deviceName === undefined || device.deviceName.length < 1) {
            toast.warn("Fill device name field.");
            return;
        }
        else if (device.deviceName === undefined || device.deviceName.length < 3) {
            toast.warn("Device name should be min 3 char");
            return;
        }
        if (device.friendlyName === undefined || device.friendlyName.length < 1) {
            toast.warn("Fill device friendly name field.");
            return;
        }
        else if (device.friendlyName === undefined || device.friendlyName.length < 3) {
            toast.warn("Device friendly name should be min 3 char");
            return;
        } else if (device.manufacturerName === undefined || device.manufacturerName.length < 3) {
            toast.warn("Device manufacturer name should be min 3 char");
            return;
        }
        if (device.deviceTypeId === undefined || device.deviceTypeId === "") {
            toast.warn("Please select device type");
            return;
        }
        if (device.roomId === undefined || device.roomId === "") {
            toast.warn("Please select room");
            return;
        }
        Api.Post(isDeviceUpdate ? apiUrlData.deviceController.updateDevice : apiUrlData.deviceController.addDevice, device)
            .then(res => {
                toast.success(!isDeviceUpdate ? "Device is created" : " Device is updated");
                setIsDeviceCreated(true);
            }).catch(err => {
                setLoadingData(false);
                toast.error(common.toastMsg.error);
            });
    }
    if (loadingData)
        return <Loader></Loader>
    if (!userRole?.canView)
        return <Unauthorized></Unauthorized>
    return (
        <div className="page-container">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/Device">Device</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{!isDeviceUpdate ? 'Add ' : 'Update '} Device</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-header bg-primary bg-gradient">
                            <h6 className="card-title">{!isDeviceUpdate ? 'Add ' : 'Update '} Device</h6>
                        </div>
                        <div className="card-body">
                            <form>
                                <div class="container">
                                    <div class="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                                        <div class="col">
                                            <div className="mb-3">
                                                <label htmlFor="txtDeviceName" className="form-label">Device Name<strong className="text-danger">*</strong></label>
                                                <input type="text" name="deviceName" value={device.deviceName} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceName" aria-describedby="txtDeviceNameHelp" />
                                                <div id="txtDeviceNameHelp" className="form-text">Enter the device name</div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div className="mb-3">
                                                <label htmlFor="txtDeviceFriendlyName" className="form-label">Device Friendly Name<strong className="text-danger">*</strong></label>
                                                <input type="text" name="friendlyName" value={device.friendlyName} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceFriendlyName" aria-describedby="txtDeviceFriendlyNameHelp" />
                                                <div id="txtDeviceFriendlyNameHelp" className="form-text">Enter the alexa friendly name eg. Living Room Light</div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div className="mb-3">
                                                <label htmlFor="txtDeviceDesc" className="form-label">Device Description</label>
                                                <textarea name="deviceDesc" value={device.deviceDesc} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceDesc" aria-describedby="txtDeviceDescHelp" />
                                                <div id="txtDeviceDescHelp" className="form-text">Enter the desire Device description</div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div className="mb-3">
                                                <label htmlFor="txtManufacturerName" className="form-label">Manufacturer Name<strong className="text-danger">*</strong></label>
                                                <input type="text" name="manufacturerName" value={device.manufacturerName} onChange={e => inputHandler(e)} className="form-control" id="txtManufacturerName" aria-describedby="txtManufacturerNameHelp" />
                                                <div id="txtManufacturerNameHelp" className="form-text">Enter the desire Device manufacturer name</div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div className="mb-3">
                                                <label htmlFor="txtDeviceType" className="form-label">Device Type<strong className="text-danger">*</strong></label>
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
                                        </div>
                                        <div class="col">
                                            <div className="mb-3">
                                                <label htmlFor="txtRoomKey" className="form-label">Room Name<strong className="text-danger">*</strong></label>
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
                                        </div>
                                        <div class="col">
                                            <div className="mb-3">
                                                <label htmlFor="txtModel" className="form-label">Model</label>
                                                <input type="text" name="model" value={device.model} onChange={e => inputHandler(e)} className="form-control" id="txtModel" aria-describedby="txtModelHelp" />
                                                <div id="txtModelHelp" className="form-text">Enter the desire Device model Number</div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div className="mb-3">
                                                <label htmlFor="txtSerialNumber" className="form-label">SerialNumber</label>
                                                <input type="text" name="serialNumber" value={device.serialNumber} onChange={e => inputHandler(e)} className="form-control" id="txtSerialNumber" aria-describedby="txtSerialNumberHelp" />
                                                <div id="txtSerialNumberHelp" className="form-text">Enter the desire Device Serial Number</div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div className="mb-3">
                                                <label htmlFor="txtFirmwareVersion" className="form-label">Firmware Version</label>
                                                <input type="text" name="firmwareVersion" value={device.firmwareVersion} onChange={e => inputHandler(e)} className="form-control" id="txtFirmwareVersion" aria-describedby="txtFirmwareVersionHelp" />
                                                <div id="txtFirmwareVersionHelp" className="form-text">Enter the desire Device Firmware Version</div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div className="mb-3">
                                                <label htmlFor="txtSoftwareVersion" className="form-label">Software Version</label>
                                                <input type="text" name="softwareVersion" value={device.softwareVersion} onChange={e => inputHandler(e)} className="form-control" id="txtSoftwareVersion" aria-describedby="txtSoftwareVersionHelp" />
                                                <div id="txtSoftwareVersionHelp" className="form-text">Enter the desire Device Software Version</div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div className="mb-3">
                                                <label htmlFor="txtcustomIdentifier" className="form-label">Custom Identifier</label>
                                                <input type="text" name="customIdentifier" value={device.customIdentifier} onChange={e => inputHandler(e)} className="form-control" id="txtCustomIdentifier" aria-describedby="txtCustomIdentifierHelp" />
                                                <div id="txtCustomIdentifierHelp" className="form-text">Enter the desire Device Custom Identifier</div>
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-12 col-sm-12 col-xs-12">
                                            <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isDeviceUpdate ? 'Add ' : 'Update '} Device </button>
                                        </div>
                                    </div>
                                </div>
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
