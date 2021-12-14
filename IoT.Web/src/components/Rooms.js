import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from './Loader';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { common } from "../Configurations/common";
import Unauthorized from './CustomView/Unauthorized';
import TableView from './Tables/TableView';
export default function Rooms({ userRole }) {
    const breadcrumbOption = [{ name: 'Home', link: "/Dashboard", isActive: true }, { name: 'Rooms', link: "", isActive: false }]
    const [roomData, setRoomData] = useState(common.getDefault(common.dataType.array));
    const [loadingData, setLoadingData] = useState(true);
    const [searchTerm, setsearchTerm] = useState("All");
    const apiUrlData = require('../Configurations/apiUrl.json');
    const handleDelete = (val) => {
        setLoadingData(true);
        Api.Delete(apiUrlData.roomController.deleteRoom + '?roomkey=' + val).then(res => {
            setLoadingData(false);
            setsearchTerm("All");
            handleSerach();
            toast.success("Room Deleted.")
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    let tableOption = {
        headers: ['Room', 'Description'],
        columns: ['roomName', 'roomDesc'],
        rowData: roomData,
        idName: 'roomKey',
        editUrl: "/RoomCreate?roomkey=",
        rowNumber: true,
        action: true,
        userRole: userRole,
        NoRecordMsg: 'No Data Found',
        deleteHandler: handleDelete
    }
    const handleSerach = (val) => {
        val = val === undefined || typeof val==='object'? searchTerm : val;
        if (val !== "All" && (val === "" || val.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.roomController.searchRoom + '?searchterm=' + val).then(res => {
            setRoomData(res.data);
            setLoadingData(false)
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    useEffect(() => {
        Api.Get(apiUrlData.roomController.getAllRoom).then(res => {
            setRoomData(res.data);
            setLoadingData(false)
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }, []);
    if (!userRole.canView)
        return <Unauthorized></Unauthorized>
    return (
        <div className="page-container">
            {
                loadingData && <Loader></Loader>
            }
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex justify-content-between bd-highlight mb-3">
                <div className="p-2 bd-highlight">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        {userRole.canCreate && <Link to="/RoomCreate"><div className="btn btn-sm btn-outline-primary"><i className="fa fa-plus"></i> Add</div></Link>}
                        {userRole.canView && <button type="button" onClick={e => handleSerach('All')} className="btn btn-sm btn-outline-primary"><i className="fa fa-sync-alt"></i></button>}
                    </div>
                </div>
                <div className="p-2 "><p className="h5">Rooms</p></div>
                <div className="p-2 bd-highlight">
                    <div className="input-group mb-3">
                        {userRole.canView && (<input type="text" value={searchTerm} onChange={e => setsearchTerm(e.target.value)} className="form-control form-control-sm" placeholder="Search Room" aria-label="Search Rooms" aria-describedby="button-addon2" />)}
                        {userRole.canView && (<button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSerach}><i className="fa fa-search"></i></button>)}
                    </div>
                </div>
            </div>
            <TableView options={tableOption} userRole={userRole}></TableView>
        </div>
    )
}
