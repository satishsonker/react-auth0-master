import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Loader from './Loader';
import { common } from '../Configurations/common';
import Unauthorized from '../components/CustomView/Unauthorized';
import ConfirmationBox from './Controls/ConfirmationBox';

export default function Device({userRole}) {
    const [deviceData, setDeviceData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [searchTerm, setsearchTerm] = useState("All");    
    const [deletingKey, setDeletingKey] = useState("");
    const apiUrlData = require('../Configurations/apiUrl.json'); 
    const breadcrumbOption = [{ name: 'Home', link: "/Dashboard", isActive: true }, { name: 'Devices', link: "", isActive: false }]
    const handleDelete = (val) => {
        setLoadingData(true);
        Api.Delete(apiUrlData.deviceController.deleteDevice + '?devicekey=' + val).then(res => {
            setLoadingData(false);
            setsearchTerm("All");
            handleSerach();
            toast.success("Device Deleted.")
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }
    const handleSerach = (keyword) => {
        keyword=!common.hasValue(keyword)?searchTerm:keyword;
        if (keyword !== "All" && (keyword === "" || keyword.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.deviceController.searchDevice + '?searchterm=' + keyword).then(res => {
            setDeviceData(res.data);
            setLoadingData(false);
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }
    useEffect(() => {
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.deviceController.getAllDevice));
        Api.MultiCall(ApiCalls).then(res => {
            setDeviceData(res[0].data);
            setLoadingData(false);
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }, []);
    const handleSetDeleteKey = (key) => {
        setDeletingKey(key);
    }
    if(loadingData)
    return <Loader></Loader>
    if (!userRole?.canView) {
        return <Unauthorized></Unauthorized>
    }
    return (
        <div className="page-container">
        <ConfirmationBox options={{deleteHandler:handleDelete,data:deletingKey}}></ConfirmationBox>
        <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex justify-content-between bd-highlight mb-3">
                <div className="p-2 bd-highlight">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        {userRole?.canCreate && <Link to="/devicecreate" > <button type="button" className="btn btn-sm btn-outline-primary"><i className="fa fa-plus"></i> Add</button></Link>}
                        <button type="button" onClick={e=>{handleSerach('All'); setsearchTerm('');}} className="btn btn-sm btn-outline-primary"><i className="fa fa-sync-alt"></i></button>
                    </div>
                </div>
                <div className="p-2 "><p className="h5">Devices</p></div>
                <div className="p-2 bd-highlight">
                    <div className="input-group mb-3">
                        <input type="text" value={searchTerm} onChange={e => setsearchTerm(e.target.value)} className="form-control form-control-sm" placeholder="Search Devices" aria-label="Search Devices" aria-describedby="button-addon2" />
                        <button className="btn btn-outline-secondary" type="button" onClick={e => handleSerach()} id="button-addon2"><i className="fa fa-search"></i></button>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Device</th>
                            <th scope="col">Friendly Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Device Type</th>
                            <th scope="col">Power State</th>
                            <th scope="col">Room</th>
                            <th scope="col">Model</th>
                            <th scope="col">Serial Number</th>
                            <th scope="col">Firmware Version</th>
                            <th scope="col">Software Version</th>
                            <th scope="col">Custom Identifier</th>
                            <th scope="col">API Key</th>
                            <th scope="col">Last Connected</th>
                            <th scope="col">No Of Times Connected</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deviceData && deviceData.length === 0 && (
                            <tr>
                                <td className="text-center" colSpan="10">No Data Found</td>
                            </tr>
                        )
                        }
                        {
                            deviceData && (deviceData.map((ele, ind) => {
                                return (
                                    <tr key={ele.deviceId}>
                                        <td className="text-center">{ind + 1}</td>
                                        <td className="text-center">{ele.deviceName}
                                            <div className="copy-key">{ele.deviceKey?.substring(0, ele.deviceKey.length - 6) + ele.deviceKey?.substring(ele.deviceKey.length - 6, ele.deviceKey.length).replace(/[a-z\d]/gi, "#")} <i className="fas fa-copy text-primary" title="Copy device Id" onClick={e => common.copyToClipboard(ele.deviceKey)}></i></div></td>
                                        <td className="text-center">{ele.friendlyName}</td>
                                        <td className="text-center">{ele.deviceDesc}</td>
                                        <td className="text-center"><img alt="Device Type" className="img-icon" src={"/assets/images/" + ele.deviceTypeName + '.png'} /> {' ' + ele.deviceTypeName}
                                        </td>
                                        <td className="text-center">{ele?.status?.toLowerCase()==='on'?<div><i className="fas fa-bolt text-success"></i> ON</div>:<div><i className="fas fa-bolt text-danger"></i> OFF</div>}</td>
                                        <td className="text-center">{ele.roomName}</td>
                                        <td className="text-center">{ele.model}</td>
                                        <td className="text-center">{ele.serialNumber}</td>
                                        <td className="text-center">{ele.firmwareVersion}</td>
                                        <td className="text-center">{ele.softwareVersion}</td>
                                        <td className="text-center">{ele.customIdentifier}</td>
                                        <td className="text-center">Default</td>
                                        <td className="text-center">{common.getDateTime(ele.lastConnected)}</td>
                                        <td className="text-center">{ele.connectionCount}</td>
                                        <td className="text-center">
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                {userRole?.canUpdate && <Link to={"/DeviceCreate?id=" + ele.deviceKey}><div className="btn btn-sm btn-outline-success"><i className="fas fa-pencil-alt" aria-hidden="true"></i></div></Link>}
                                                {userRole?.canDelete && <button type="button" value={ele.deviceKey} data-bs-toggle="modal" data-bs-target="#confirmModelBox" onClick={e => handleSetDeleteKey(ele.deviceKey)} className="btn btn-sm btn-outline-danger"><i data-devicekey={ele.deviceKey} className="fa fa-trash"></i></button>}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
