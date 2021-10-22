import React, { useEffect, useState } from 'react'
import Unauthorized from '../CustomView/Unauthorized';
import { Link } from "react-router-dom";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { common } from "../../Configurations/common";
import UpdateDeleteButton from '../Buttons/UpdateDeleteButton';
export default function DeviceType({userRole}) {
    const [deviceTypeData, setDeviceTypeData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [searchTerm, setsearchTerm] = useState("All");
    const apiUrlData = require('../../Configurations/apiUrl.json');
    useEffect(() => {
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.deviceController.getDeviceTypeDropdown));
        Api.MultiCall(ApiCalls).then(res => {
            setDeviceTypeData(res[0].data);
            setLoadingData(false)
        });
    }, []);
    const handleDelete = (e) => {
        var val = e.target.value ? e.target.value : e.target.dataset.deletekey;
        setLoadingData(true);
        Api.Delete(apiUrlData.adminController.deleteDeviceType + '?devicetypeid=' + val).then(res => {
            setLoadingData(false);
            setsearchTerm("All");
            handleSerach();
            toast.success("Device type deleted.")
        })
    }
    const handleSerach = (e) => {
       setsearchTerm(common.hasValue(e)?e:searchTerm);
        if (searchTerm !== "All" && (searchTerm === "" || searchTerm.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.adminController.searchDeviceType + '?searchterm=' + searchTerm).then(res => {
            setDeviceTypeData(res.data);
            setLoadingData(false)
        })
    }
    if (!userRole?.isAdmin) {
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
                    <li className="breadcrumb-item active" aria-current="page">Device Type</li>
                </ol>
            </nav>
            <div className="d-flex justify-content-between bd-highlight mb-3">
                <div className="p-2 bd-highlight">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        {userRole.canCreate && <Link to="/admin/DeviceTypeCreate"><div className="btn btn-sm btn-outline-primary"><i className="fa fa-plus"></i> Add</div></Link>}
                        {userRole.canView && <button type="button" onClick={e => handleSerach("All")} className="btn btn-sm btn-outline-primary"><i className="fa fa-sync-alt"></i></button>}
                    </div>
                </div>
                <div className="p-2 "><p className="h5">Rooms</p></div>
                <div className="p-2 bd-highlight">
                    <div className="input-group mb-3">
                        {userRole.canView && (<input type="text" value={searchTerm} onChange={e => setsearchTerm(e.target.value)} className="form-control form-control-sm" placeholder="Search Room" aria-label="Search Devices" aria-describedby="button-addon2" />)}
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
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deviceTypeData && deviceTypeData.length === 0 && (
                                <tr>
                                    <td className="text-center" colSpan="3">No Data Found</td>
                                </tr>
                            )
                            }
                            {
                                deviceTypeData && (deviceTypeData.map((ele, ind) => {
                                    return (
                                        <tr key={ele.deviceTypeId}>
                                            <td >{ind + 1}</td>
                                            <td>{ele.deviceTypeName}</td>
                                            <td><UpdateDeleteButton userRole={userRole} deleteHandler={handleDelete} dataKey={ele.deviceTypeId} editUrl="/admin/DeviceTypeCreate?devicetypeid="></UpdateDeleteButton>
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
