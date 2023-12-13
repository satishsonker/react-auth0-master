import React, { useState, useEffect } from 'react'
import { Navigate } from "react-router-dom";
import { Api } from "../../Configurations/Api";
import Loader from '../Loader';
import { common } from "../../Configurations/common";
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
export default function GroupCreate({ userRole }) {
    const [loadingData, setLoadingData] = useState(false);
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [isGroupCreated, setIsGroupCreated] = useState(common.getDefault(common.dataType.bool));
    const [group, setGroup] = useState({
        groupName: '',
        groupKey: ''
    });
    const [isGroupUpdate, setIsGroupUpdate] = useState(common.getDefault(common.dataType.bool));
    const breadcrumbOption = [{ name: 'Home', link: "/Dashboard", isActive: true }, { name: 'Groups', link: "/groups", isActive: true }, { name: 'Create Group', link: "", isActive: false }]
    const inputHandler = (e) => {
        setGroup({...group,[e.target.name]:e.target.value});
    }
    const handleSubmit = (e) => {
        if(group.groupName.length<3)
        {
            toast.warn("Please enter atleast 3 char");
            return;
        }
        let url = !isGroupUpdate ? apiUrlData.deviceGroupController.addDeviceGroup : apiUrlData.deviceGroupController.updateDeviceGroup;
        setLoadingData(true);
        Api.Post(url, group).then(res => {
            setLoadingData(false);
            if (res.data > 0){
                toast.success(isGroupUpdate ? "Group updated" : "Group Added");
                setIsGroupCreated(true);
            }
            else
                toast.warn(isGroupUpdate ? "unable to update Group" : "unable to add Group");
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }
    useEffect(() => {
        let queryParam = common.queryParam(window.location.search);
        let obj = {};
        if (queryParam.name !== undefined && queryParam.id !== undefined) {
            obj['groupName'] = queryParam.name;
            obj['groupKey'] = queryParam.id;
            setGroup(obj);
            setIsGroupUpdate(true);
        }
    }, [])
    return (
        <div className="page-container">
            {
                userRole.canView &&
                <>
                {
                    loadingData && <Loader></Loader>
                }
                    <Breadcrumb option={breadcrumbOption}></Breadcrumb>
                    <div className="row">
                        <div className="col mb-3">
                            <div className="card text-black">
                                <div className="card-header bg-primary bg-gradient">
                                    <h6 className="card-title">{!isGroupUpdate ? 'Add ' : 'Update '} Group</h6>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="txtGroupName" className="form-label">Group Name<strong className="text-danger">*</strong></label>
                                            <input type="text" name="groupName" value={group.groupName} onChange={e => inputHandler(e)} className="form-control" id="txtGroupName" aria-describedby="txtGroupNameHelp" />
                                            <div id="txtGroupNameHelp" className="form-text">Enter the group name</div>
                                        </div>
                                        <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isGroupUpdate ? 'Add ' : 'Update '} Group </button>
                                        {isGroupCreated  && (
                                            <Navigate to="/Groups"></Navigate>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}
