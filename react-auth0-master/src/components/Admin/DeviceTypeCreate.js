import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { common } from "../../Configurations/common";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "../Loader";
export default function DeviceTypeCreate() {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [isDeviceTypeUpdating, setIsDeviceTypeUpdating] = useState(false);
    const [isDeviceTypeCreated, setIsDeviceTypeCreated] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [deviceType, setDeviceType] = useState({});
    useEffect(() => {
        debugger;
        let devicetypeid = common.queryParam(window.location.search)?.devicetypeid;
        devicetypeid = !common.hasValue(devicetypeid) ? 0 :parseInt(devicetypeid);
        async function getData() {
            await Api.Get(apiUrlData.adminController.getDeviceType + '?devicetypeId=' + devicetypeid).then(res => {
                setDeviceType(res.data);
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
        setDeviceType({ ...deviceType, [e.target.name]: e.target.value });
    };
    const handleSubmit = () => {
        if (deviceType.deviceTypeName.length < 1) {
            toast.warn("Please enter deviceType name.");
            return;
        }
        else if (deviceType.deviceTypeName.length < 3) {
            toast.warn("deviceType name should be min 3 char.");
            return;
        }
        Api.Post(!isDeviceTypeUpdating ? apiUrlData.adminController.addDeviceType : apiUrlData.adminController.updateDeviceType, deviceType).then(res => {
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
                                    <label htmlFor="txtDeviceTypeName" className="form-label">Device Type<strong className="text-danger">*</strong></label>
                                    <input type="text" name="deviceTypeName" value={deviceType.deviceTypeName} onChange={e => inputHandler(e)} className="form-control" id="txtDeviceTypeName" aria-describedby="txtDeviceTypeNameHelp" />
                                    <div id="txtDeviceTypeNameHelp" className="form-text">Enter the desire device type name</div>
                                </div>

                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isDeviceTypeUpdating ? 'Add ' : 'Update '} Device Type</button>
                                {isDeviceTypeCreated && (
                                    <Redirect to="/admin/DeviceType"></Redirect>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
