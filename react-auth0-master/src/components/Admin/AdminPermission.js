import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { common } from "../../Configurations/common";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "../Loader";
import Unauthorized from "../CustomView/Unauthorized";

export default function AdminPermission() {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [userRole, setUserRole] = useState({});
    const [adminPermissions, setAdminPermissions] = useState([{}]);
    const [loadingData, setLoadingData] = useState(true);
    useEffect(() => {
        debugger;
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.userController.getUserPermission));
        ApiCalls.push(Api.Get(apiUrlData.userController.getAllUserPermissions));
        Api.MultiCall(ApiCalls).then(res => {
            setUserRole(res[0].data);
            setAdminPermissions(res[1].data);
            setLoadingData(false)
        });
    }, []);
    const handleChange = (e, index) => {
        debugger;
        adminPermissions[index][e.target.name] = e.target.checked;
        setAdminPermissions(...adminPermissions);
    }
    if (!userRole?.isAdmin) {
        return <Unauthorized></Unauthorized>
    }
    return (
        <div className="page-container">
            {loadingData && (<Loader></Loader>)}
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
                                        {adminPermissions && adminPermissions.length === 0 && (
                                            <tr>
                                                <td className="text-center" colSpan="7">No Data Found</td>
                                            </tr>
                                        )
                                        }
                                        {
                                            adminPermissions && (adminPermissions?.map((ele, ind) => {
                                                return (
                                                    <tr key={ele?.userPermissionId}>
                                                        <td >{ind + 1}</td>
                                                        <td>{ele?.user?.firstName + " " + ele?.user?.lastName}</td>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
