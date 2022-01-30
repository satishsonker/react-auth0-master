import React, { useState, useEffect } from 'react'
import Breadcrumb from './Breadcrumb/Breadcrumb';
import { Api } from "../Configurations/Api";
import { common } from "../Configurations/common";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import '../css/favouriteDevice.css';
export default function FavouriteDevice({ userRole, setPubMsg, mqttPayload }) {
    const [reload, setReload] = useState(common.getDefault(common.dataType.bool))
    const [loadingData, setLoadingData] = useState(common.getDefault(common.dataType.bool));
    const apiUrlData = require('../Configurations/apiUrl.json');
    const [deviceData, setDeviceData] = useState(common.getDefault(common.dataType.arrayObject));
    const [mqttMessage, setMqttMessage] = useState([]);
    const breadcrumbOption = [
        { name: 'Home', link: "/Dashboard" },
        { name: 'Favourite Device', isActive: false }];
    const handleUpdateFavourite = (deviceKey) => {
        let url = apiUrlData.deviceController.updatefavourite.replace('{deviceKey}', deviceKey).replace("{isFavourite}", 'false');
        Api.Post(url, {}).then(res => {
            if (res.data) {
                toast.success('Unmark favourite');
                setReload(Math.random() * 100);
                setPubMsg({ action: "ping" });
            }
        }).catch(err => {
            toast.error(common.toastMsg.error);
        })
    }
    useEffect(() => {
        if (mqttPayload?.topic) {
            setMqttMessage([JSON.parse(mqttPayload.message.replace(/'/g, '"').replace(',]', ']'))]);
        }
    }, [mqttPayload])
    useEffect(() => {
        let data = deviceData;
        
        data.map((ele, ind) => {
            if (ele.hasOwnProperty('deviceKey') && ele.deviceKey === mqttMessage[0]?.devices[0]) {                
            debugger;
                data[ind]["wifi"] = mqttMessage[0]["wifi"];
                data[ind]["ip"]=mqttMessage[0]["ip"];
                data[ind]["status"]=mqttMessage[0]["status"];                
            }
        });
        if(data.length>0 && data[0].hasOwnProperty('deviceKey')){
        setDeviceData(data);
        }
    }, [mqttMessage])
    useEffect(() => {
        setLoadingData(true);
        Api.Get(apiUrlData.deviceController.getFavourite)
            .then(res => {
                setDeviceData(res.data);
                console.table(res.data);
                setLoadingData(false);
                setPubMsg({ action: "ping" });
            })
            .catch(err => {
                toast.error(common.toastMsg.error);
            });
    }, [reload]);
    if (loadingData)
        return <Loader></Loader>
    return (
        <>
        
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">
  Tooltip on top
</button>
            {
                userRole?.canView && <div className="d-flex flex-wrap flex-fill mb-3">
                    {
                        deviceData?.map(ele => {
                            return <div className="p-2 bd-dark mw-200">
                                <div className="card text-center">
                                    <div className="card-header">
                                        {ele.deviceName}
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title device-desc">{ele.deviceDesc}</h5>
                                        <span>
                                            <img className='device-logo' src={`/assets/images/${ele?.deviceType?.deviceTypeName}.png`} />
                                        </span>
                                    </div>
                                    <div className="card-footer text-muted">
                                        <div className="d-flex justify-content-center">
                                            <div className="px-1 bd-highlight"><i className="fas fa-plug"></i></div>
                                            <div className="px-1 bd-highlight"><i className="fas fa-power-off" style={{ color: common.defaultIfEmpty(ele?.status,"")!=="" || common.defaultIfEmpty(ele?.status,"")==="OFF"?'green':'red'}}></i></div>
                                            <div className="px-1 bd-highlight"><i className="fas fa-wifi" style={{ color: common.defaultIfEmpty(ele?.wifi,"")!==""?'green':'red'}}></i></div>
                                            <div className="px-1 bd-highlight"><i style={{ color: 'red', cursor: 'pointer' }} onClick={e => { handleUpdateFavourite(ele.deviceKey) }} className="fas fa-heart-broken"></i></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            }

        </>
    )
}
