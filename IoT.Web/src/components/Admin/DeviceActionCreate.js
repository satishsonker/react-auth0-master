import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { common } from "../../Configurations/common";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "../Loader";
import Unauthorized from "../CustomView/Unauthorized";
export default function DeviceActionCreate() {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [isDeviceTypeUpdating, setIsDeviceTypeUpdating] = useState(false);
    const [isDeviceTypeCreated, setIsDeviceTypeCreated] = useState(false);
    const [userRole, setUserRole] = useState({});
    const [deviceTypeData, setDeviceTypeData] = useState([{
        deviceTypeId:0,
        devicTypeName:''
    }]);
    const [deviceActionData, setDeviceActionData] = useState({
        deviceTypeId:'',
        deviceActionName:'',
        deviceActionNameBackEnd:'',
        deviceActionValue:''
});
    const [loadingData, setLoadingData] = useState(false);
    useEffect(() => {
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.userController.getUserPermission));
        ApiCalls.push(Api.Get(apiUrlData.deviceController.getDeviceTypeDropdown));
        Api.MultiCall(ApiCalls).then(res => {
            setUserRole(res[0].data);
            setDeviceTypeData(res[1].data);
            setLoadingData(false)
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
        let devicetypeid = common.queryParam(window.location.search)?.deviceActionId;
        devicetypeid = !common.hasValue(devicetypeid) ? 0 :parseInt(devicetypeid);
        async function getData() {
            await Api.Get(apiUrlData.adminController.getDeviceAction + '?deviceActionId=' + devicetypeid).then(res => {
                setDeviceActionData(res.data);
                setLoadingData(false)
            }).catch(err=>{
                setLoadingData(false);
                toast.error(common.toastMsg.error);
              });
        }
        if (!loadingData) {
            if (devicetypeid !== 0) {
                setIsDeviceTypeUpdating(true);
                getData();
            }
        }
    },[]);

    const inputHandler = (e) => {
        var val=e.target.name==='deviceTypeId'?parseInt(e.target.value):e.target.value;
        setDeviceActionData({ ...deviceActionData, [e.target.name]: val});
    };
    const handleSubmit = () => {
        if (deviceActionData.deviceTypeId==="") {
            toast.warn("Please select the device type");
            return;
        }
        else if (deviceActionData.deviceActionName.length < 1) {
            toast.warn("Please enter device action name.");
            return;
        }
        else if (deviceActionData.deviceActionName.length < 3) {
            toast.warn("Device action name should be min 3 char.");
            return;
        }
        else if (deviceActionData.deviceActionNameBackEnd.length < 1) {
            toast.warn("Please enter device action backend name.");
            return;
        }
        
        Api.Post(!isDeviceTypeUpdating ? apiUrlData.adminController.addDeviceAction : apiUrlData.adminController.updateDeviceAction, deviceActionData).then(res => {
            toast.success(!isDeviceTypeUpdating ? "Device action is created" : "Device action is updated");
            setIsDeviceTypeCreated(true);
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }
    if(!userRole?.isAdmin)
    {
        return <Unauthorized></Unauthorized>
    }
    return (
        <div className="page-container">
            {loadingData && (<Loader></Loader>)}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/admin/deviceAction">Device Action</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{!isDeviceTypeUpdating ? 'Add ' : 'Update '} Device Action</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-header bg-primary bg-gradient">
                            <h6 className="card-title">{!isDeviceTypeUpdating ? 'Add ' : 'Update '}  Device Action</h6>
                        </div>
                        <div className="card-body">
                            <form>
                            <div className="mb-3">
                                    <label htmlFor="txtDeviceTypeId" className="form-label">Device Type<strong className="text-danger">*</strong></label>
                                    <select name="deviceTypeId" value={deviceActionData?.deviceTypeId} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceTypeId" aria-describedby="txtDeviceTypeIdHelp">
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
                                    <label htmlFor="txtDeviceActionValue" className="form-label">Device Action Value</label>
                                    <input type="text" name="deviceActionValue" value={deviceActionData?.deviceActionValue} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceActionValue" aria-describedby="txtDeviceActionValueHelp" />
                                    <div id="txtDeviceActionValueHelp" className="form-text">Enter the desire device action value</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtDeviceActionNameBackend" className="form-label">Device Action Name Backend<strong className="text-danger">*</strong></label>
                                    <input type="text" name="deviceActionNameBackEnd" value={deviceActionData?.deviceActionNameBackEnd} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceActionNameBackend" aria-describedby="txtDeviceActionNameBackendHelp" />
                                    <div id="txtDeviceActionNameBackendHelp" className="form-text">Enter the desire device action backend name</div>
                                </div>

                         { (userRole?.canCreate && !isDeviceTypeUpdating) || (userRole?.canUpdate && isDeviceTypeUpdating)  &&      <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isDeviceTypeUpdating ? 'Add ' : 'Update '} Device Action</button>}
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
