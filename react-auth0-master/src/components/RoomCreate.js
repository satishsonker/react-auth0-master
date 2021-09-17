import React, { useState,useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "./Loader";
export default function RoomCreate() {
    const { user } = useAuth0();
    const apiUrlData = require('../Configurations/apiUrl.json');
    const [isRoomUpdating, setIsRoomUpdating] = useState(false);
    const [isRoomCreated, setIsRoomCreated] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [room, setRoom] = useState({
        "userKey": user.sub.split("|")[1],
        "roomName": '',
        "roomDesc": ''
    });
    function queryParam(params) {
        console.log(params);
        if (params === undefined || params==="" || params===null) {
            return {};
        }
        params = "{\"" +
            params
                .replace(/\?/gi, "")
                .replace(/&/gi, "\",\"")
                .replace(/=/gi, "\":\"") +
            "\"}";

        params = JSON.parse(params);
        return params
    }
    useEffect(() => {
        let roomKey = queryParam(window.location.search)?.roomkey;
        roomKey = roomKey === undefined || roomKey === null ? '' : roomKey;
        async function getData() {
            await Api.Get(apiUrlData.roomController.getRoom+'?roomkey='+roomKey).then(res => {
                setRoom(res.data);
                setLoadingData(false)
            }).catch(xx => {
                toast.error('Something went wrong');
            })
        }
        if (!loadingData) {
            if (roomKey !== "") {
                setIsRoomUpdating(true);
                getData();
            }
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
        }).catch(ee => {
            toast.error("Something went wrong !");
        });
    }
    return (
        <div className="page-container">
            {loadingData && (<Loader></Loader>)}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/Rooms">Rooms</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{!isRoomUpdating ? 'Add ' : 'Update '} Room</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-header bg-primary bg-gradient">
                            <h6 className="card-title">{!isRoomUpdating ? 'Add ' : 'Update '}  Rooms</h6>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="txtRoomName" className="form-label">Room Name<strong className="text-danger">*</strong></label>
                                    <input type="text" name="roomName" value={room.roomName} onChange={e => inputHandler(e)} className="form-control" id="txtRoomName" aria-describedby="txtRoomNameHelp" />
                                    <div id="txtRoomNameHelp" className="form-text">Enter the desire room name</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtRoomDesc" className="form-label">Room Description</label>
                                    <textarea name="roomDesc" value={room.roomDesc} onChange={e => inputHandler(e)} className="form-control" id="txtRoomDesc" aria-describedby="txtRoomDescHelp" />
                                    <div id="txtRoomDescHelp" className="form-text">Enter the desire room description</div>
                                </div>

                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isRoomUpdating ? 'Add ' : 'Update '} Room</button>
                                {isRoomCreated && (
                                    <Redirect to="/rooms"></Redirect>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
