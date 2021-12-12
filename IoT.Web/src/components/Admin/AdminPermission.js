import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { common } from "../../Configurations/common";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "../Loader";
import Unauthorized from "../CustomView/Unauthorized";

export default function AdminPermission({userRole}) {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    //const [userRole, setUserRole] = useState(common.getDefault(common.dataType.object));
    const [adminPermissions, setAdminPermissions] = useState(common.getDefault(common.dataType.arrayObject));
    const [loadingData, setLoadingData] = useState(true);
    useEffect(() => {
        let ApiCalls = common.getDefault(common.dataType.array);
        ApiCalls.push(Api.Get(apiUrlData.userController.getUserPermission));
        ApiCalls.push(Api.Get(apiUrlData.userController.getAllUserPermissions));
        Api.MultiCall(ApiCalls).then(res => {
            //setUserRole(res[0].data);
            setAdminPermissions(res[1].data);
            setLoadingData(false)
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }, []);
    const handleChange = (e, index) => {
        let data = common.cloneObject(adminPermissions);
        data[index][e.target.name] = e.target.checked;
        setAdminPermissions(data);
    }
    const handleSubmit = () => {
        Api.Post(apiUrlData.adminController.updateAdminPermission, adminPermissions).then(res => {
            if (res.data) {
                toast.success('Permissions updated');
            }
            else
                toast.warn('Unable to updated permissions');
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }
    if(loadingData)
    return <Loader></Loader>
    if (!userRole?.isAdmin) {
        return <Unauthorized></Unauthorized>
    }
    return (
        <div className="page-container">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Admin Permission</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-header bg-primary bg-gradient">
                            <h6 className="card-title"> Admin Permission</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">User Name</th>
                                            <th scope="col">View Access</th>
                                            <th scope="col">Create Access</th>
                                            <th scope="col">Update Access</th>
                                            <th scope="col">Delete Access</th>
                                            <th scope="col">Is Admin User</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!common.hasValue(adminPermissions) || adminPermissions.length === 0 && (
                                            <tr key="2">
                                                <td className="text-center" colSpan="7">No Data Found</td>
                                            </tr>
                                        )
                                        }
                                        {
                                            adminPermissions && adminPermissions.length > 0 && (adminPermissions?.map((ele, ind) => {
                                                return (
                                                    <tr key={ele.userPermissionId?.toString()}>
                                                        <td >{ind + 1}</td>
                                                        <td>{common.getDefaultIfEmpty(common.getDefaultIfEmpty(ele?.user?.firstName) + " " + common.getDefaultIfEmpty(ele?.user?.lastName), 'No Name')}</td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input onChange={e => handleChange(e, ind)} name="canView" className="form-check-input" type="checkbox" checked={ele?.canView} id="flexSwitchCheckDefault" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input onChange={e => handleChange(e, ind)} name="canCreate" className="form-check-input" type="checkbox" checked={ele?.canCreate} id="flexSwitchCheckDefault" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input onChange={e => handleChange(e, ind)} name="canUpdate" className="form-check-input" type="checkbox" checked={ele?.canUpdate} id="flexSwitchCheckDefault" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input onChange={e => handleChange(e, ind)} name="canDelete" className="form-check-input" type="checkbox" checked={ele?.canDelete} id="flexSwitchCheckDefault" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input onChange={e => handleChange(e, ind)} name="isAdmin" className="form-check-input" type="checkbox" checked={ele?.isAdmin} id="flexSwitchCheckDefault" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            }))
                                        }
                                    </tbody>
                                </table>
                                {userRole?.canUpdate && <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">Update</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
