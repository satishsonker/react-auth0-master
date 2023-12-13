import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { common } from "../../Configurations/common";
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import TableHeader from '../Tables/TableHeader';
import ConfirmationBox from '../Controls/ConfirmationBox';

export default function Groups({ userRole, setPubMsg }) {
    const [loadingData, setLoadingData] = useState(false);
    const [groupData, setGroupData] = useState([]);
    const [deletingGroupKey, setDeletingGroupKey] = useState("");
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const breadcrumbOption = [{ name: 'Home', link: "/Dashboard", isActive: true }, { name: 'Groups', link: "", isActive: false }]
    const handleSerach = (searchTerm) => {
        if (searchTerm !== "All" && (searchTerm === "" || searchTerm.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.deviceGroupController.searchDeviceGroup + searchTerm).then(res => {
            setLoadingData(false);
            setGroupData(res.data);
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    };
    const tableHeaderOption = {
        searchHandler: handleSerach,
        headerName: 'Device Group',
        addUrl: "/group/createGroup"
    }
    useEffect(() => {
        setLoadingData(true);
        let ApiCalls = [];
        ApiCalls.push(Api.Get(`${apiUrlData.deviceGroupController.getDeviceGroups}`));
        Api.MultiCall(ApiCalls).then(res => {
            setLoadingData(false);
            setGroupData(res[0].data);
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }, [userRole]);
    const getDeviceList = (ele) => {
        let deviceList = [];
        ele.deviceGroupDetails.forEach(element => {
            deviceList.push(element.device.deviceKey);
        });
        return deviceList;
    }
    const handleTurnOnOffDevice = (deviceList, isOn) => {
        let pubMsgs = [];
        let value = isOn ? 'OFF' : 'ON';
        deviceList.map(ele => {
            pubMsgs.push({
                deviceId: ele,
                action: common.getCommandObj(value).action,
                topic: common.getApiKey(),
                value: common.getCommandObj(value).value,
            });
        });
        setPubMsg(pubMsgs);
    }

    const handleSetDelete = (groupKey) => {
        setDeletingGroupKey(groupKey);
    }

    const handleDelete = (key) => {
        if (deletingGroupKey.length > 0) {
            setLoadingData(true);
            Api.Delete(apiUrlData.deviceGroupController.deleteDeviceGroup + deletingGroupKey).then(res => {
                setLoadingData(false);
                handleSerach("All");
                toast.success("Group deleted successfully.")
            }).catch(err => {
                setLoadingData(false);
                toast.error(common.toastMsg.error);
            });
        }
    }
    if (loadingData)
        return <Loader></Loader>
    return (
        <div className="page-container">
            {userRole.canView &&
                <>
                    <Breadcrumb option={breadcrumbOption}></Breadcrumb>
                    <TableHeader option={tableHeaderOption} userRole={userRole}></TableHeader>
                    <ConfirmationBox options={{data:deletingGroupKey, deleteHandler: handleDelete, modelBoxId: "deleteModal" }}></ConfirmationBox>
                    <div className="row row-cols-1 row-cols-md-4 g-4">
                        {
                            groupData.map(ele => {
                                return <>
                                    <div className="col">
                                        <div className="card h-100">
                                            <div className="card-header">
                                                <div className="d-flex bd-highlight">
                                                    <div className="p-2 flex-grow-1 bd-highlight"> {ele.groupName}</div>
                                                    <div className="p-2 bd-highlight">
                                                        <i title="Turn On" onClick={e => handleTurnOnOffDevice(getDeviceList(ele), false)} className="fas fa-power-off text-success" style={{ cursor: 'pointer' }}></i>
                                                    </div>
                                                    <div className="p-2 bd-highlight">
                                                        <i title="Turn Off" onClick={e => handleTurnOnOffDevice(getDeviceList(ele), true)} className="fas fa-power-off text-danger" style={{ cursor: 'pointer' }}></i>
                                                    </div>
                                                    <div className="p-2 bd-highlight">
                                                        <Link to={"/group/createGroup?name=" + ele.groupName + "&id=" + ele.groupKey}><i title="Edit group" className="fas fa-pencil-alt" style={{ cursor: 'pointer' }}></i></Link>
                                                    </div>
                                                    <div className="p-2 bd-highlight">
                                                        <i title="Delete group" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={e => handleSetDelete(ele.groupKey)} className="fas fa-trash-alt" style={{ cursor: 'pointer' }}></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title">Total Devices</h5>
                                                <Link to={"/group/groupdetails?name=" + ele.groupName + "&id=" + ele.groupKey}>
                                                    <p className="card-text">{ele.deviceGroupDetails.length}</p>
                                                </Link>
                                                <Link to={"/group/addDevice?name=" + ele.groupName + "&id=" + ele.groupKey}>
                                                    <p className="card-text">{ele.deviceGroupDetails.length}</p>
                                                </Link>
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
