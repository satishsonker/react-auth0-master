import React, { useState } from 'react'
import { Link,Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
export default function RoomCreate() {
    toast.configure();
    const { user } = useAuth0();
    const apiUrlData = require('../Configurations/apiUrl.json');
    const [isDisable, setDisable] = useState(true);
    const [isRoomCreated, setIsRoomCreated] = useState(false);
    const [room, setRoom] = useState({
        "userKey": user.sub.split("|")[1],
        "RoomName": '',
        "RoomDesc": ''
    });
    const [formError, setError] = useState({
        "RoomName": '',
        "RoomDesc": ''
    });
    const inputHandler = (e) => {
        console.log(isDisable);
        setDisable(true);
        console.log(isDisable);
        setRoom({ ...room, [e.target.name]: e.target.value });
        debugger;
        if (room.RoomName.length < 1)
            setError({ [formError.RoomName]: "Fill this field." })
        else if (room.RoomName.length < 3)
            setError({ [formError.RoomName]: "Minimum 3 char required." })
        else {
            setError({ [formError.RoomName]: "" })
            setDisable(false);
        }
        console.log(isDisable);
    };
    const handleSubmit = () => {
        //alert(room.RoomName);
        Api.Post(apiUrlData.roomController.addRoom, room).then(res => {
         toast.success("Room is created");
        setIsRoomCreated(true);
        }).catch(ee => {
            toast.error("Something went wrong !");
        });
    }
    return (
        <div className="page-container">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/Rooms">Rooms</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Create Rooms</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-header bg-primary bg-gradient">
                            <h6 className="card-title">Add Rooms</h6>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="txtRoomName" className="form-label">Room Name<strong className="text-danger">*</strong></label>
                                    <input type="text" name="RoomName" value={room.RoomName} onChange={e => inputHandler(e)} className="form-control" id="txtRoomName" aria-describedby="txtRoomNameHelp" />
                                    {formError.RoomName?.length > 0 && (<div id="txtRoomNameHelp" className="form-text">Enter the desire room name</div>)}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtRoomDesc" className="form-label">Room Description</label>
                                    <textarea name="RoomDesc" value={room.roomDesc} onChange={e => inputHandler(e)} className="form-control" id="txtRoomDesc" aria-describedby="txtRoomDescHelp" />
                                    <div id="txtRoomDescHelp" className="form-text">Enter the desire room description</div>
                                </div>

                                <button type="button" disabled={isDisable ? "disabled" : ""} onClick={e => handleSubmit(e)} className="btn btn-primary">Submit</button>
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
