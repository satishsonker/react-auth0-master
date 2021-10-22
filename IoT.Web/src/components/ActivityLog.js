import React, { useState, useEffect } from 'react'
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
export default function ActivityLog() {
    const [activityData, setActivityData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const apiUrlData = require('../Configurations/apiUrl.json');
    useEffect(() => {
        async function getData() {
            await Api.Get(apiUrlData.activityLogController.getAll).then(res => {
                setActivityData(res.data);
                setLoadingData(false)
            }).catch(xx => {
                toast.error('Something went wrong');
            })
        }
        if (loadingData) {
            getData();
        }
    }, [loadingData, apiUrlData.roomController.getAllRoom]);

    return (
        <div className="page-container">
            {
                loadingData && <Loader></Loader>
            }
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Activity Log</li>
                </ol>
            </nav>
            <div style={{margin:20+'px'}}>
                <div className="d-flex justify-content-between bd-highlight mb-3 text-center">
                    <div className="p-2 "><p className="h5">Activity Log</p></div>
                </div>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">IP Address</th>
                                <th scope="col">Location</th>
                                <th scope="col">APP Name</th>
                                <th scope="col">Activity</th>
                                <th scope="col">Time Stamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activityData && activityData.length === 0 && (
                                <tr>
                                    <td className="text-center" colSpan="6">No Data Found</td>
                                </tr>
                            )
                            }
                            {
                                activityData && (activityData.map((ele, ind) => {
                                    return (
                                        <tr key={ele?.activityId}>
                                            <td >{ind + 1}</td>
                                            <td>{ele?.ipAddress}</td>
                                            <td>{ele?.locaton}</td>
                                            <td>{ele?.appName}</td>
                                            <td>{ele?.activity}</td>
                                            <td>{ele?.createdDate}</td>
                                        </tr>
                                    )
                                }))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
