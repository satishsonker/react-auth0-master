import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { common } from "../../Configurations/common";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "../Loader";
export default function DeviceActionCreate() {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [isDeviceTypeUpdating, setIsDeviceTypeUpdating] = useState(false);
    const [isDeviceTypeCreated, setIsDeviceTypeCreated] = useState(false);
    const [deviceTypeData, setDeviceTypeData] = useState([{
        deviceTypeId:0,
        devicTypeName:''
    }]);
    const [deviceActionData, setDeviceActionData] = useState({});
    const [loadingData, setLoadingData] = useState(false);
    useEffect(() => {
        Api.Get(apiUrlData.deviceController.getDeviceTypeDropdown).then(res=>{
            setDeviceTypeData(res.data);
        });
        let devicetypeid = common.queryParam(window.location.search)?.devicetypeid;
        devicetypeid = !common.hasValue(devicetypeid) ? 0 :parseInt(devicetypeid);
        async function getData() {
            await Api.Get(apiUrlData.adminController.getDeviceType + '?devicetypeId=' + devicetypeid).then(res => {
                setDeviceActionData(res.data);
                setLoadingData(false)
            }).catch(xx => {
                toast.error('Something went wrong');
            })
        }
        if (!loadingData) {
            debugger;
            if (devicetypeid !== 0) {
                setIsDeviceTypeUpdating(true);
                getData();
            }
        }
    }, [loadingData, apiUrlData.roomController.getRoom]);

    const inputHandler = (e) => {
        setDeviceActionData({ ...deviceActionData, [e.target.name]: e.target.value });
    };
    const handleSubmit = () => {
        if (deviceActionData.deviceTypeName.length < 1) {
            toast.warn("Please enter deviceType name.");
            return;
        }
        else if (deviceActionData.deviceTypeName.length < 3) {
            toast.warn("deviceType name should be min 3 char.");
            return;
        }
        Api.Post(!isDeviceTypeUpdating ? apiUrlData.adminController.addDeviceType : apiUrlData.adminController.updateDeviceType, deviceActionData).then(res => {
            toast.success(!isDeviceTypeUpdating ? "Device type is created" : "Device type is updated");
            setIsDeviceTypeCreated(true);
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
                    <li className="breadcrumb-item"><Link to="/admin/devicetype">Device Type</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{!isDeviceTypeUpdating ? 'Add ' : 'Update '} deviceType</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-header bg-primary bg-gradient">
                            <h6 className="card-title">{!isDeviceTypeUpdating ? 'Add ' : 'Update '}  Device Type</h6>
                        </div>
                        <div className="card-body">
                            <form>
                            <div className="mb-3">
                                    <label htmlFor="txtDeviceTypeId" className="form-label">Device Type<strong className="text-danger">*</strong></label>
                                    <select name="deviceTypeId" value={deviceActionData?.deviceId} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceTypeId" aria-describedby="txtDeviceTypeIdHelp">
                                        <option value="">Select Device Type</option>
                                        {deviceTypeData?.map((ele)=>{
                                            return <option value={ele.deviceTypeId}>{ele.deviceTypeName}</option>
                                        })}
                                    </select>
                                    <div id="txtDeviceTypeIdHelp" className="form-text">Enter the desire device type name</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtDeviceActionName" className="form-label">Device Action Name<strong className="text-danger">*</strong></label>
                                    <input type="text" name="deviceActionName" value={deviceActionData?.deviceActionName} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceActionName" aria-describedby="txtDeviceActionNameHelp" />
                                    <div id="txtDeviceActionNameHelp" className="form-text">Enter the desire device action name</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtDeviceActionValue" className="form-label">Device Action Value<strong className="text-danger">*</strong></label>
                                    <input type="text" name="deviceActionValue" value={deviceActionData?.deviceActionValue} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceActionValue" aria-describedby="txtDeviceActionValueHelp" />
                                    <div id="txtDeviceActionValueHelp" className="form-text">Enter the desire device action value</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtDeviceActionNameBackend" className="form-label">Device Action Name Backend<strong className="text-danger">*</strong></label>
                                    <input type="text" name="deviceActionNameBackend" value={deviceActionData?.DeviceActionNameBackend} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceActionNameBackend" aria-describedby="txtDeviceActionNameBackendHelp" />
                                    <div id="txtDeviceActionNameBackendHelp" className="form-text">Enter the desire device action backend name</div>
                                </div>

                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isDeviceTypeUpdating ? 'Add ' : 'Update '} Device Type</button>
                                {isDeviceTypeCreated && (
                                    <Redirect to="/admin/DeviceAction"></Redirect>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
