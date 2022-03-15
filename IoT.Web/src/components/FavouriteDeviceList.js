import React, { useState, useEffect } from 'react';
import './../css/favouriteDeviceList.css';
import { common } from "../Configurations/common";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
export default function FavouriteDeviceList() {
    const [deviceData, setDeviceData] = useState(common.getDefault(common.dataType.arrayObject));
    const apiUrlData = require('../Configurations/apiUrl.json');
    useEffect(() => {
        Api.Get(apiUrlData.deviceController.getFavourite)
            .then(res => {
                setDeviceData(res.data);
            })
            .catch(err => {
                toast.error(common.toastMsg.error);
            });
    }, []);

    return (
        <>
            <div className='row row-col-12'>
                <div className='col device-list-container'>
                    <ul className='device-list'>
                        {deviceData.map((ele,ind) => {
                            return <li key={ind} className='device-list-item'>
                                <div className='device-name'>{ele.deviceName}</div>
                                <div className='fav-device-control'>
                                    <div className='fav-device-control-light'>
                                        <i className='fas fa-power-off'></i>
                                    </div>
                                </div>
                                <div className='device-name'>{ele.deviceDesc}</div>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}
