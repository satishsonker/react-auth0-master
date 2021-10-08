import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from './Loader';
import UpdateDeleteButton from './Buttons/UpdateDeleteButton';
import { common } from "../Configurations/common";
import Unauthorized from './CustomView/Unauthorized';
import TableView from './Tables/TableView';
export default function Rooms({ userRole }) {
    const [roomData, setRoomData] = useState(common.getDefault(common.dataType.array));
    const [loadingData, setLoadingData] = useState(true);
    const [searchTerm, setsearchTerm] = useState("All");
    const apiUrlData = require('../Configurations/apiUrl.json');    
    const handleDelete = (e) => {
        var val = e.target.value ? e.target.value : e.target.dataset.deletekey;
        setLoadingData(true);
        Api.Delete(apiUrlData.roomController.deleteRoom + '?roomkey=' + val).then(res => {
            setLoadingData(false);
            setsearchTerm("All");
            handleSerach();
            toast.success("Room Deleted.")
        });
    }
    let tableOption={
        headers : ['Room','Description'],
        columns : ['roomName','roomDesc'],
        rowData : roomData,
        idName : 'roomKey',
        editUrl : "/RoomCreate?roomkey=",
        rowNumber : true,
        action : true,
        userRole :  userRole,
        NoRecordMsg : 'No Data Found',
        deleteHandler : handleDelete
    }
    const handleSerach = (e) => {
        if (searchTerm !== "All" && (searchTerm === "" || searchTerm.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.roomController.searchRoom + '?searchterm=' + searchTerm).then(res => {
            setRoomData(res.data);
            setLoadingData(false)
        });
    }
    useEffect(() => {
        async function getData() {
            await Api.Get(apiUrlData.roomController.getAllRoom).then(res => {
                setRoomData(res.data);
                setLoadingData(false)
            }).catch(xx => {
                toast.error('Something went wrong');
            })
        }
        if (loadingData) {
            getData();
        }
    }, [roomData, loadingData, apiUrlData.roomController.getAllRoom]);
    if (!userRole.canView)
        return <Unauthorized></Unauthorized>
    return (
        <div className="page-container">
            {
                loadingData && <Loader></Loader>
            }
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Rooms</li>
                </ol>
            </nav>

            <div className="d-flex justify-content-between bd-highlight mb-3">
                <div className="p-2 bd-highlight">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        {userRole.canCreate && <Link to="/RoomCreate"><div className="btn btn-sm btn-outline-primary"><i className="fa fa-plus"></i> Add</div></Link>}
                        {userRole.canView && <button type="button" onClick={e => handleSerach(e)} className="btn btn-sm btn-outline-primary"><i className="fa fa-sync-alt"></i></button>}
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
            <TableView options={tableOption}></TableView>
            {/* <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Room</th>
                            <th scope="col">Description</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomData && roomData.length === 0 && (
                            <tr>
                                <td className="text-center" colSpan="4">No Data Found</td>
                            </tr>
                        )
                        }
                        {
                            roomData && (roomData.map((ele, ind) => {
                                return (
                                    <tr key={ele.roomId}>
                                        <td >{ind + 1}</td>
                                        <td>{ele.roomName}
                                            <div>{ele.roomKey}</div>
                                        </td>
                                        <td>{ele.roomDesc}</td>
                                        <td>
                                            {ele.roomKey && (
                                                <UpdateDeleteButton userRole={userRole} deleteHandler={handleDelete} dataKey={ele.roomKey} editUrl="/RoomCreate?roomkey="></UpdateDeleteButton>)}
                                        </td>
                                    </tr>
                                )
                            }))
                        }
                    </tbody>
                </table>
            </div>*/}
        </div> 
    )
}
