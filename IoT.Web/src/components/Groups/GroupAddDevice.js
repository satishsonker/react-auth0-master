import React, { useState, useEffect } from 'react'
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import { Api } from "../../Configurations/Api";
import Loader from '../Loader';
import { common } from "../../Configurations/common";
import { toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';
export default function GroupAddDevice({ userRole }) {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [groupName, setGroupName] = useState('Group');
    const [groupKey, setGroupId] = useState('');
    const breadcrumbOption = [
        { name: 'Home', link: "/Dashboard", isActive: true },
        { name: 'Groups', link: "/groups", isActive: true },
        { name: 'Add Device', link: "", isActive: false }
    ];
    const [deviceData, setDeviceData] = useState(common.getDefault(common.dataType.array));
    const [deviceGroupData, setDeviceGroupData] = useState(common.getDefault(common.dataType.array));
    const [deviceGroupDataPost, setDeviceGroupDataPost] = useState(common.getDefault(common.dataType.array));
    const [loadingData, setLoadingData] = useState(common.getDefault(common.dataType.bool));
    const [isGroupUpdated, setIsGroupUpdated] = useState(common.getDefault(common.dataType.bool));
    const [deviceInGroup, setDeviceInGroup] = useState([])
    useEffect(() => {
        let queryParam = common.queryParam(window.location.search);
        if (queryParam.name !== undefined && queryParam.id !== undefined) {
            setGroupName(queryParam.name);
            setGroupId(queryParam.id);
            setLoadingData(true);
            let ApiCalls = [];
            ApiCalls.push(Api.Get(apiUrlData.deviceController.getAllDevice));
            ApiCalls.push(Api.Get(apiUrlData.deviceGroupController.getDeviceGroupDetail + queryParam.id));
            debugger;
            Api.MultiCall(ApiCalls).then(res => {
                setLoadingData(false);
                setDeviceGroupData(res[1].data);
                setDeviceData(res[0].data);
                let deviceIds = [];
                let data = [];
                res[1].data.forEach(ele => {
                    deviceIds.push(ele.deviceId);
                    data.push({
                        DeviceId: ele.deviceId,
                        GroupKey: groupKey,
                        GroupId: 0
                    });
                });
                setDeviceGroupDataPost(data);
                setDeviceInGroup(deviceIds);
            }).catch(err=>{
                setLoadingData(false);
                toast.error(common.toastMsg.error);
              });
        }
    }, []);
    const handleSubmit = () => {
        setLoadingData(true);
        if (deviceGroupDataPost.length === 0) {
            toast.warn('Please select atleast one device');
            return;
        }
        Api.Post(apiUrlData.deviceGroupController.addDeviceGroupDetail + groupKey, deviceGroupDataPost).then(res => {
            setLoadingData(false);
            if (res.data > 0)
            {
                toast.success("Group updated successfully");
                setIsGroupUpdated(true);
            }
            else
                toast.warn("Group isn't updated successfully");
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    const isDeviceInGroup = (deviceId) => {
        return deviceInGroup.indexOf(deviceId) > -1 ? true : false;
    }
    const handleCheck = (e, deviceId) => {
        debugger;
        let data = deviceGroupDataPost;
        let deviceIds = deviceInGroup;
        if (e.target.checked) {
            data.push({
                DeviceId: deviceId,
                GroupKey: groupKey,
                GroupId: 0
            });
            if (deviceIds.indexOf(deviceId) === -1)
                deviceIds.push(deviceId);
        }
        else {
            data = [];
            deviceGroupDataPost.forEach(ele => {
                if (ele.DeviceId !== deviceId) {
                    data.push(ele);
                }
            });
            deviceIds.pop(deviceId);
        }
        setDeviceGroupDataPost(data);
        setDeviceInGroup(deviceIds);
    }
    return (
        <div className="page-container">
            {userRole.canView &&
                <>
                    {
                        loadingData && <Loader></Loader>
                    }
                    <Breadcrumb option={breadcrumbOption}></Breadcrumb>
                    <div className="row">
                        <div className="col mb-3">
                            <div className="card text-black">
                                <div className="card-header bg-primary bg-gradient">
                                    <h6 className="card-title">Add Device in {groupName} Group</h6>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex bd-highlight">
                                        <div className="p-2 flex-grow-1 bd-highlight">{deviceInGroup.length} Selected</div>
                                        <div className="p-2 bd-highlight"></div>
                                        <div className="p-2 bd-highlight">{deviceData.length} Devices</div>
                                    </div>
                                    <ol className="list-group list-group">
                                        {
                                            deviceData.map(ele => {
                                                return <li key={ele.deviceId} className="list-group-item d-flex justify-content-between align-items-start">

                                                    <div className="d-flex bd-highlight">
                                                        <div className="p-2 bd-highlight">
                                                            {
                                                                deviceInGroup.indexOf(ele.deviceId) > -1 ?

                                                                    <input checked="checked" onChange={e => { handleCheck(e, ele.deviceId) }} className="form-check-input me-1" type="checkbox" value="" aria-label="..." /> :

                                                                    <input onChange={e => { handleCheck(e, ele.deviceId) }} className="form-check-input me-1" type="checkbox" value="" aria-label="..." />
                                                            }
                                                        </div>
                                                        <div className="p-2 flex-grow-1 bd-highlight">
                                                            <div className="ms-2 me-auto text-sm">
                                                                <div className="fs-6">{ele.deviceName}</div>
                                                                <small className="fs-6 fw-lighter">{ele.deviceDesc}</small>
                                                                <div className="fs-6 fw-lighter"><small>{ele.roomName}</small></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="badge bg-success rounded-pill">  <small>{ele.deviceTypeName}</small></span>
                                                </li>
                                            })
                                        }
                                    </ol>
                                    <div class="d-flex flex-row-reverse bd-highlight mt-3">
                                        <div class="p-2 bd-highlight">
                                            <button type="button" onClick={e => handleSubmit()} className="btn btn-primary">Add</button>
                                            {
                                                isGroupUpdated && <Redirect to="/groups"></Redirect>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}
