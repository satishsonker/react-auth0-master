import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { common } from "../../Configurations/common";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "../Loader";

import Unauthorized from '../CustomView/Unauthorized';
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
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
    const [capInterface, setCapInterface] = useState(common.getDefault(common.dataType.arrayObject));
    const [capVersion, setCapVersion] = useState(common.getDefault(common.dataType.arrayObject));
    const [capType, setCapType] = useState(common.getDefault(common.dataType.arrayObject));
    const [capSupProp, setCapSupProp] = useState(common.getDefault(common.dataType.arrayObject));
    const [displayCategory, setDisplayCategory] = useState([{key:'DOORBELL',label:'Doorbell'},{key:'SMARTLOCK',label:'Smart Lock'},{key:'MOTION_SENSOR',label:'Motion Sensor'},{key:'LIGHT',label:'Light'},{key:'SWITCH',label:'Switch'}]); //[{ key: 'LIGHT', label: "Light" },{ key: 'SWITCH', label: "Switch" }]
    const [deviceTypeData, setDeviceTypeData] = useState(common.getDefault(common.dataType.arrayObject));

    useEffect(() => {
        let deviceCapabilityid = common.queryParam(window.location.search)?.capabilityid;
        deviceCapabilityid = !common.hasValue(deviceCapabilityid) ? 0 : parseInt(deviceCapabilityid);
        let Apis = [];
        Apis.push(Api.Get(apiUrlData.deviceController.getDeviceTypeDropdown));
        Apis.push(Api.Get(apiUrlData.masterDataController.getAllCapabilityDropdownData));
        Api.MultiCall(Apis).then(res => {
            setDeviceTypeData(res[0].data);
            setCapInterface(res[1].data.capabilityInterfaces);
            setCapVersion(res[1].data.capabilityVersions);
            setCapType(res[1].data.capabilityTypes);
            setCapSupProp(res[1].data.capabilitySupportedProperties);
            let disCap = [];
            res[1].data.displayCategories.map((ele) => {
                disCap.push({ key: ele.key, label: ele.value });
            });
            setDisplayCategory(disCap);
            let cc=displayCategory;
            setLoadingData(false);
        }).catch(err=>{
            setLoadingData(false);
        });
        async function getData() {
            setLoadingData(true);
            await Api.Get(apiUrlData.adminController.getDeviceCapability + '?devicecapabilityid=' + deviceCapabilityid).then(res => {
                res.data.displayCategory = !common.hasValue(res.data.displayCategory) || res.data.displayCategory === '' ? 'LIGHT' : res.data.displayCategory;
                setDeviceCapability(res.data);
                setLoadingData(false);
            }).catch(xx => {
                toast.error('Something went wrong');
                setLoadingData(false);
            })
        }
        if (!loadingData) {
            if (deviceCapabilityid !== 0) {
                setIsDeviceCapabilityUpdating(true);
                getData();
            }
        }
    }, [apiUrlData.roomController.getRoom]);

    const inputHandler = (e, name) => {
        let data = common.cloneObject(deviceCapability);
        if (!common.hasValue(name)) {
            let value = e.target.value;
            if (e.target.name === 'deviceTypeId' && value !== '') {
                value = parseInt(value);
            }
            if (e.target.name === 'proactivelyReported' || e.target.name === 'retrievable') {
                value = data[e.target.name] === 'on' ? '' : 'on';
            }
            data[e.target.name] = value;
        }
        else {
            data[name] = e.toString();
        }
        setDeviceCapability({ ...data });
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
                                                return <option key={ind} value={ele.deviceTypeId}>{ele.deviceTypeName}</option>
                                            })
                                        }
                                    </select>
                                    <div id="ddlDeviceTypeHelp" className="form-text">Select device type name</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtCapabilityType" className="form-label">Device Capability Type<strong className="text-danger">*</strong></label>
                                    <select name="capabilityType" value={deviceCapability?.capabilityType} onChange={e => inputHandler(e)} className="form-control" id="txtCapabilityType" aria-describedby="txtCapabilityTypeHelp">
                                        <option value="">Select Type</option>
                                        {
                                            capType?.map((ele, ind) => {
                                                return <option key={ind} value={ele.value}>{ele.value}</option>
                                            })
                                        }
                                    </select>
                                    <div id="txtCapabilityTypeHelp" className="form-text">Select device capability type</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ddlVersion" className="form-label">Version<strong className="text-danger">*</strong></label>
                                    <select name="version" value={deviceCapability?.version} onChange={e => inputHandler(e)} className="form-control" id="ddlVersion" aria-describedby="ddlVersioneHelp">
                                        <option value="">Select version</option>
                                        {
                                            capVersion?.map((ele, ind) => {
                                                return <option key={ind} value={ele.value}>{ele.value}</option>
                                            })
                                        }
                                    </select>
                                    <div id="ddlVersionHelp" className="form-text">Select device capability version</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ddlDisplayCategory" className="form-label">Display Category<strong className="text-danger">*</strong></label>
                                    <DropdownMultiselect options={displayCategory} selected={!common.hasValue(deviceCapability.displayCategory) ? [] : deviceCapability.displayCategory?.split(',')} name="displayCategory" handleOnChange={e => inputHandler(e, 'displayCategory')} />
                                    <div id="ddlDisplayCategoryHelp" className="form-text">Select device display category</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtCapabilityInterface" className="form-label">Capability Interface<strong className="text-danger">*</strong></label>
                                    <select name="capabilityInterface" value={deviceCapability?.capabilityInterface} onChange={e => inputHandler(e)} className="form-control" id="txtCapabilityInterface" aria-describedby="txtCapabilityInterfaceHelp">
                                        <option value="">Select Interface</option>
                                        {
                                            capInterface?.map((ele, ind) => {
                                                return <option key={ind} value={ele.value}>{ele.value}</option>
                                            })
                                        }
                                    </select>
                                    <div id="txtCapabilityInterfaceHelp" className="form-text">Enter device capability Interface</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtSupportedProperty" className="form-label">Supported Property<strong className="text-danger">*</strong></label>
                                    <select type="text" name="supportedProperty" value={deviceCapability?.supportedProperty} onChange={e => inputHandler(e)} className="form-control" id="txtSupportedProperty" aria-describedby="txtSupportedPropertyHelp">
                                        <option value="">Select Supported Property</option>
                                        {
                                            capSupProp?.map((ele, ind) => {
                                                return <option key={ind} value={ele.value}>{ele.value}</option>
                                            })
                                        }
                                    </select>
                                    <div id="txtSupportedPropertyHelp" className="form-text">Enter device capability Supported Property</div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check form-switch">
                                        <input name="proactivelyReported" onChange={e => inputHandler(e)} className="form-check-input" type="checkbox" id="flexSwitchCheckDisabled" checked={deviceCapability.proactivelyReported} />
                                        <label className="form-check-label" htmlFor="flexSwitchCheckDisabled">Proactively Reported</label>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input name="retrievable" onChange={e => inputHandler(e)} className="form-check-input" type="checkbox" id="flexSwitchCheckCheckedDisabled" checked={deviceCapability.retrievable} />
                                        <label className="form-check-label" htmlFor="flexSwitchCheckCheckedDisabled">Retrievable</label>
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
