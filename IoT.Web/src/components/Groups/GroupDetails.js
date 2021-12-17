import React, { useEffect, useState } from 'react'
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import { Api } from "../../Configurations/Api";
import Loader from '../Loader';
import '../../css/groupDetails.css';
import { toast } from 'react-toastify';
import { common } from '../../Configurations/common';
export default function GroupDetails({ userRole,setPubMsg }) {
    const [isOn, setIsOn] = useState(common.getDefault(common.dataType.bool));
    const [loadingData, setLoadingData] = useState(common.getDefault(common.dataType.bool));
    const [groupData, setGroupData] = useState(common.getDefault(common.dataType.array));
    const [groupName, setGroupname] = useState(common.getDefault(common.dataType.string));
    const [groupDetailsData, setGroupDetailsData] = useState(common.getDefault(common.dataType.array));
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const breadcrumbOption = [{ name: 'Home', link: "/Dashboard", isActive: true }, { name: 'Groups', link: "/groups", isActive: true }, , { name: 'Group Details', link: "", isActive: false }]
    useEffect(() => {
        setLoadingData(true);
        let ApiCalls = []; let queryParam = common.queryParam(window.location.search);
        if (queryParam.name !== undefined && queryParam.id !== undefined) {
            setGroupname(queryParam.name);
            ApiCalls.push(Api.Get(apiUrlData.deviceGroupController.getDeviceGroups));
            Api.MultiCall(ApiCalls).then(res => {
                setLoadingData(false);
                setGroupData(res[0].data);
                getGroupDetails(queryParam.id);
            }).catch(err => {
                toast.error(common.toastMsg.error);
                setLoadingData(false);
            });
        }
    }, [userRole]);
    const getDeviceList = (ele) => {
        let deviceList = [];
        ele.forEach(element => {
            deviceList.push(element.device.deviceKey);
        });
        return deviceList;
    }
    const handleTurnOnOffDevice = (deviceList, isOn) => {
        let pubMsgs = [];
        let value = !isOn ? 'OFF' : 'ON';
        deviceList.map(ele => {
            pubMsgs.push({
                deviceId: ele,
                action: common.getCommandObj(value).action,
                topic: common.getApiKey(),
                value: common.getCommandObj(value).value,
            });
        });
        setIsOn(!isOn);
        setPubMsg(pubMsgs);
    }
    const getGroupDetails = (groupKey) => {
        setLoadingData(true);
        let ApiCalls = [];
        ApiCalls.push(Api.Get(`${apiUrlData.deviceGroupController.getDeviceGroupDetail + groupKey}`));
        Api.MultiCall(ApiCalls).then(res => {
            setLoadingData(false);
            setGroupDetailsData(res[0].data);
        }).catch(err => {
            toast.error(common.toastMsg.error);
            setLoadingData(false);
        });
    }
    if (loadingData)
        return <Loader></Loader>
    return (
        <div className="page-container">
            {userRole.canView &&
                <>
                    <Breadcrumb option={breadcrumbOption}></Breadcrumb>
                    <div className="row row-cols-12 row-cols-md-12 g-4">
                        <div className="col">
                            <nav style={{ "--bs-breadcrumb-divider": "'>';" }} aria-label="breadcrumb">
                                <ol className="breadcrumb" style={{ fontSize: 17 + "px" }}>
                                    <li className="breadcrumb-item"><a href="#"> All Groups</a></li>
                                    {
                                        groupData.map(ele => {
                                            return <>
                                                <li className="breadcrumb-item"><a href={"/group/groupdetails?name="+ele.groupName+"&id="+ele.groupKey}> {ele.groupName}</a></li>
                                            </>
                                        })
                                    }
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="row row-cols-12 row-cols-md-12 g-4">
                        <div className="col col-header">
                            <div className="d-flex justify-content-center bd-highlight">
                                <div className="p-2 bd-highlight">
                                    <div className="d-flex flex-column bd-highlight mb-3">
                                        <div className="bd-highlight text-center">{groupName}</div>
                                        <div style={{fontSize:"35px",cursor:"pointer"}} onClick={e=>{handleTurnOnOffDevice(getDeviceList(groupDetailsData),isOn)}} className={isOn? "bd-highlight text-center text-success":"bd-highlight text-center text-danger"}><i class="fas fa-power-off"></i></div>
                                        <div className="bd-highlight text-center">OFF</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-8">
                        {
                            groupDetailsData.map(ele => {
                                return <>
                                    <div className="col" style={{ paddingRight: '10px' }}>
                                        <div className="col-device">
                                            <div className="d-flex flex-column bd-highlight">
                                                <div className="pt-2 bd-highlight"><small>{ele.device.deviceName}</small></div>
                                                <div className="bd-highlight"><small>OFF</small></div>
                                            </div>
                                            <div className="d-flex align-items-end" style={{ height: '76px' }}>
                                                <div className="pb-2 flex-fill bd-highlight"><small>{ele.device.deviceType.deviceTypeName}</small></div>
                                                <div className="pb-2 bd-highlight"><small>...</small></div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            })

                        }
                    </div>
                </>
            }
        </div>
    )
}
