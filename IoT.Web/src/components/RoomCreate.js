import React, { useState, useEffect } from 'react'
import { Link, Navigate } from "react-router-dom";
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "./Loader";
import { common } from '../Configurations/common';
export default function RoomCreate({ userRole }) {
    const breadcrumbOption = [{ name: 'Home', link: "/Dashboard", isActive: true }, { name: 'Rooms', link: "/rooms", isActive: true }, { name: 'Add Rooms', link: "", isActive: false }]

    const { user } = {isLoading:false,isAuthenticated:true,user:{name:'satish'}}
    const apiUrlData = require('../Configurations/apiUrl.json');
    const [isRoomUpdating, setIsRoomUpdating] = useState(false);
    const [isRoomCreated, setIsRoomCreated] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [room, setRoom] = useState({
        "userKey": user.sub.split("|")[1],
        "roomName": '',
        "roomDesc": ''
    });
    useEffect(() => {
        let roomKey = common.queryParam(window.location.search)?.roomkey;
        roomKey = !common.hasValue(roomKey) ? '' : roomKey;
        async function getData() {
            await Api.Get(apiUrlData.roomController.getRoom + '?roomkey=' + roomKey).then(res => {
                setRoom(res.data);
                setLoadingData(false);
            }).catch(err => {
                setLoadingData(false);
                toast.error(common.toastMsg.error);
            });
        }
        if (roomKey !== "") {
            setLoadingData(true);
            getData();
        }
    }, [loadingData, apiUrlData.roomController.getRoom]);

    const inputHandler = (e) => {
        setRoom({ ...room, [e.target.name]: e.target.value });
    };
    const handleSubmit = () => {
        if (room.roomName.length < 1) {
            toast.warn("Please enter room name.");
            return;
        }
        else if (room.roomName.length < 3) {
            toast.warn("Room name should be min 3 char.");
            return;
        }
        Api.Post(!isRoomUpdating ? apiUrlData.roomController.addRoom : apiUrlData.roomController.updateRoom, room).then(res => {
            toast.success(!isRoomUpdating ? "Room is created" : "Room is updated");
            setIsRoomCreated(true);
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    if (loadingData)
        return <Loader></Loader>
    if (!userRole?.canView)
        return <Loader></Loader>
    return (
        <div className="page-container">
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-header bg-primary bg-gradient">
                            <h6 className="card-title">{!isRoomUpdating ? 'Add ' : 'Update '}  Rooms</h6>
                        </div>
                        <div className="card-body">
                            <form>
                                <div class="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                                    <div class="col">
                                        <div className="mb-3">
                                            <label htmlFor="txtRoomName" className="form-label">Room Name<strong className="text-danger">*</strong></label>
                                            <input type="text" name="roomName" value={room.roomName} onChange={e => inputHandler(e)} className="form-control" id="txtRoomName" aria-describedby="txtRoomNameHelp" />
                                            <div id="txtRoomNameHelp" className="form-text">Enter the desire room name</div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div className="mb-3">
                                            <label htmlFor="txtRoomDesc" className="form-label">Room Description</label>
                                            <textarea name="roomDesc" value={room.roomDesc} onChange={e => inputHandler(e)} className="form-control" id="txtRoomDesc" aria-describedby="txtRoomDescHelp" />
                                            <div id="txtRoomDescHelp" className="form-text">Enter the desire room description</div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-12 col-sm-12 col-xs-12">
                                        {
                                            userRole?.canCreate && <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isRoomUpdating ? 'Add ' : 'Update '} Room</button>
                                        }
                                    </div>
                                </div>




                                {isRoomCreated && (
                                    <Navigate to="/rooms"></Navigate>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
