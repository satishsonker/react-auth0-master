import React, { useEffect, useState } from 'react'
import Unauthorized from '../CustomView/Unauthorized';
import { Link } from "react-router-dom";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { common } from "../../Configurations/common";
import UpdateDeleteButton from '../Buttons/UpdateDeleteButton';
export default function DeviceAction() {
    const [deviceActionData, setDeviceActionData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [searchTerm, setsearchTerm] = useState("All");
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [userRole, setUserRole] = useState({});
    useEffect(() => {
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.userController.getUserPermission));
        ApiCalls.push(Api.Get(apiUrlData.adminController.getAllDeviceAction));
        Api.MultiCall(ApiCalls).then(res => {
            debugger;
            setUserRole(res[0].data);
            window.iotGlobal['userRole']=res[0].data;
            setDeviceActionData(res[1].data);
            setLoadingData(false)
        });
    }, []);
    const handleDelete = (e) => {
        debugger;
        var val = e.target.value ? e.target.value : e.target.dataset.deletekey;
        setLoadingData(true);
        Api.Delete(apiUrlData.adminController.deleteDeviceAction + '?deviceactionid=' + val).then(res => {
            setLoadingData(false);
            setsearchTerm("All");
            handleSerach();
            toast.success("Device action deleted.")
        })
    }
    const handleSerach = (e) => {
       setsearchTerm(common.hasValue(e)?e:searchTerm);
        if (searchTerm !== "All" && (searchTerm === "" || searchTerm.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.adminController.searchDeviceAction + '?searchterm=' + searchTerm).then(res => {
            setDeviceActionData(res.data);
            setLoadingData(false)
        })
    }
    if (!userRole?.isAdmin && !loadingData) {
        return (<Unauthorized></Unauthorized>)
    }
    return (
        <div className="page-container">
            {
                loadingData && <Loader></Loader>
            }
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Device Action</li>
                </ol>
            </nav>
            <div className="d-flex justify-content-between bd-highlight mb-3">
                <div className="p-2 bd-highlight">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        {userRole.canCreate && <Link to="/admin/DeviceActionCreate"><div className="btn btn-sm btn-outline-primary"><i className="fa fa-plus"></i> Add</div></Link>}
                        {userRole.canView && <button type="button" onClick={e => handleSerach("All")} className="btn btn-sm btn-outline-primary"><i className="fa fa-sync-alt"></i></button>}
                    </div>
                </div>
                <div className="p-2 "><p className="h5">Device Actions</p></div>
                <div className="p-2 bd-highlight">
                    <div className="input-group mb-3">
                        {userRole.canView && (<input type="text" value={searchTerm} onChange={e => setsearchTerm(e.target.value)} className="form-control form-control-sm" placeholder="Search Device Action" aria-label="Search Device Action" aria-describedby="button-addon2" />)}
                        {userRole.canView && (<button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSerach}><i className="fa fa-search"></i></button>)}
                    </div>
                </div>
            </div>
            {userRole.canView &&
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Device Type</th>
                                <th scope="col">Device Action</th> 
                                <th scope="col">Device Action Value</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deviceActionData && deviceActionData.length === 0 && (
                                <tr>
                                    <td className="text-center" colSpan="5">No Data Found</td>
                                </tr>
                            )
                            }
                            {
                                deviceActionData && (deviceActionData.map((ele, ind) => {
                                    return (
                                        <tr key={ele.deciveActionId}>
                                            <td >{ind + 1}</td>
                                            <td>{ele.deviceType.deviceTypeName}</td>
                                            <td>{ele.deviceActionName}</td>
                                            <td>{ele.deviceActionValue}</td>
                                            <td><UpdateDeleteButton userRole={userRole} deleteHandler={handleDelete} dataKey={ele.deciveActionId} editUrl="/admin/DeviceActionCreate?deviceActionId="></UpdateDeleteButton>
                                            </td>
                                        </tr>
                                    )
                                }))
                            }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}
