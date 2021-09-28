import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { common } from "../../Configurations/common";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "../Loader";
import Unauthorized from '../CustomView/Unauthorized';
export default function DeviceCapabilityCreate({ userRole }) {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [isDeviceCapabilityUpdating, setIsDeviceCapabilityUpdating] = useState(common.getDefault(common.dataType.bool));
    const [isDeviceCapabilityCreated, setIsDeviceCapabilityCreated] = useState(common.getDefault(common.dataType.bool));
    const [loadingData, setLoadingData] = useState(common.getDefault(common.dataType.bool));
    const [deviceCapability, setDeviceCapability] = useState({
        deviceTypeId: 0,
        capabilityType: '',
        version: '',
        capabilityInterface: '',
        supportedProperty: '',
        proactivelyReported: 'on',
        retrievable: 'on'
    });
    const [deviceTypeData, setDeviceTypeData] = useState(common.getDefault(common.dataType.arrayObject));
    useEffect(() => {
        let deviceCapabilityid = common.queryParam(window.location.search)?.capabilityid;
        deviceCapabilityid = !common.hasValue(deviceCapabilityid) ? 0 : parseInt(deviceCapabilityid);
        Api.Get(apiUrlData.deviceController.getDeviceTypeDropdown).then(res => {
            setDeviceTypeData(res.data);
        });
        async function getData() {
            await Api.Get(apiUrlData.adminController.getDeviceCapability + '?devicecapabilityid=' + deviceCapabilityid).then(res => {
                setDeviceCapability(res.data);
                setLoadingData(false)
            }).catch(xx => {
                toast.error('Something went wrong');
            })
        }
        if (!loadingData) {
            if (deviceCapabilityid !== 0) {
                setIsDeviceCapabilityUpdating(true);
                getData();
            }
        }
    }, [loadingData, apiUrlData.roomController.getRoom]);

    const inputHandler = (e) => {
        let data = common.cloneObject(deviceCapability);
        let value = e.target.value;
        if (e.target.name === 'deviceTypeId' && value !== '') {
            value = parseInt(value);
        }
        if (e.target.name === 'proactivelyReported' || e.target.name === 'retrievable') {
            value = data[e.target.name]==='on'?'':'on';
        }
        data[e.target.name]=value;
        setDeviceCapability({ ...data});
    };
    const handleSubmit = () => {
        if (deviceCapability.deviceTypeId === "") {
            toast.warn("Please select the device type.");
            return;
        }
        else if (deviceCapability.capabilityType === "") {
            toast.warn("Please select the device capability type.");
            return;
        }
        else if (deviceCapability.version === "") {
            toast.warn("Please select the device capability version.");
            return;
        }
        else if (deviceCapability?.capabilityInterface?.length < 1) {
            toast.warn("Please enter device capability interface");
            return;
        }
        else if (deviceCapability?.supportedProperty?.length < 1) {
            toast.warn("Please enter device capability supported property");
            return;
        }
        deviceCapability.proactivelyReported = deviceCapability.proactivelyReported === "on" ? true : false;
        deviceCapability.retrievable = deviceCapability.retrievable === "on" ? true : false;
        Api.Post(!isDeviceCapabilityUpdating ? apiUrlData.adminController.addDeviceCapability : apiUrlData.adminController.updateDeviceCapability, deviceCapability).then(res => {
            toast.success(!isDeviceCapabilityUpdating ? "Device capability is created" : "Device capability is updated");
            setIsDeviceCapabilityCreated(true);
        }).catch(ee => {
            toast.error("Something went wrong !");
        });
    }
    if (loadingData)
        return <Loader></Loader>
    if (!userRole?.isAdmin)
        return <Unauthorized></Unauthorized>
    return (
        <div className="page-container">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/admin/deviceCapability">Device Capability</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{!isDeviceCapabilityUpdating ? 'Add ' : 'Update '} deviceCapability</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-header bg-primary bg-gradient">
                            <h6 className="card-title">{!isDeviceCapabilityUpdating ? 'Add ' : 'Update '}  Device Type</h6>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="ddlDeviceType" className="form-label">Device Type<strong className="text-danger">*</strong></label>
                                    <select name="deviceTypeId" value={deviceCapability?.deviceTypeId} onChange={e => inputHandler(e)} className="form-control" id="ddlDeviceType" aria-describedby="ddlDeviceTypeHelp">
                                        <option value="">Select Device Type</option>
                                        {
                                            deviceTypeData?.map((ele, ind) => {
                                                return <option value={ele.deviceTypeId}>{ele.deviceTypeName}</option>
                                            })
                                        }
                                    </select>
                                    <div id="ddlDeviceTypeHelp" className="form-text">Select device type name</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtCapabilityType" className="form-label">Device Capability Type<strong className="text-danger">*</strong></label>
                                    <select name="capabilityType" value={deviceCapability?.capabilityType} onChange={e => inputHandler(e)} className="form-control" id="txtCapabilityType" aria-describedby="txtCapabilityTypeHelp">
                                        <option value="">Select Interface</option>
                                        <option value="AlexaInterface">AlexaInterface</option>
                                    </select>
                                    <div id="txtCapabilityTypeHelp" className="form-text">Select device capability type</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ddlVersion" className="form-label">Version<strong className="text-danger">*</strong></label>
                                    <select name="version" value={deviceCapability?.version} onChange={e => inputHandler(e)} className="form-control" id="ddlVersion" aria-describedby="ddlVersioneHelp">
                                        <option value="">Select version</option>
                                        <option value="3">3</option>
                                    </select>
                                    <div id="ddlVersionHelp" className="form-text">Select device capability version</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtCapabilityInterface" className="form-label">Capability Interface<strong className="text-danger">*</strong></label>
                                    <input type="text" name="capabilityInterface" value={deviceCapability?.capabilityInterface} onChange={e => inputHandler(e)} className="form-control" id="txtCapabilityInterface" aria-describedby="txtCapabilityInterfaceHelp" />
                                    <div id="txtCapabilityInterfaceHelp" className="form-text">Enter device capability Interface</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtSupportedProperty" className="form-label">Supported Property<strong className="text-danger">*</strong></label>
                                    <input type="text" name="supportedProperty" value={deviceCapability?.supportedProperty} onChange={e => inputHandler(e)} className="form-control" id="txtSupportedProperty" aria-describedby="txtSupportedPropertyHelp" />
                                    <div id="txtSupportedPropertyHelp" className="form-text">Enter device capability Supported Property</div>
                                </div>
                                <div className="mb-3">
                                    <div class="form-check form-switch">
                                        <input name="proactivelyReported" onChange={e => inputHandler(e)} class="form-check-input" type="checkbox" id="flexSwitchCheckDisabled" checked={deviceCapability.proactivelyReported} />
                                        <label class="form-check-label" for="flexSwitchCheckDisabled">Proactively Reported</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input name="retrievable" onChange={e => inputHandler(e)} class="form-check-input" type="checkbox" id="flexSwitchCheckCheckedDisabled" checked={deviceCapability.retrievable} />
                                        <label class="form-check-label" for="flexSwitchCheckCheckedDisabled">Retrievable</label>
                                    </div>
                                </div>
                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isDeviceCapabilityUpdating ? 'Add ' : 'Update '} Device Capability</button>
                                {isDeviceCapabilityCreated && (
                                    <Redirect to="/admin/deviceCapability"></Redirect>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
