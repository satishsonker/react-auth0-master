import React from 'react'
import { common } from "../../Configurations/common";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import DeviceControl from '../Controls/DeviceControl';
import GasSensor from './GasSensor';
import HumiditySensor from './HumiditySensor';
import LDRSensor from './LDRSensor';
import Light from './Light';
import MoistureSensor from './MoistureSensor';
import MotionSensor from './MotionSensor';
import SoundSensor from './SoundSensor';
import TemperatureSensor from './TemperatureSensor';
import UltrasonicSensor from './UltrasonicSensor';
import WaterSensor from './WaterSensor';
export default function DeviceCard({ deviceData, index, devicePowerHandler, setPubMessage,setRefresh }) {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const handleUpdateFavourite = (isFavourite) => {
        let url = apiUrlData.deviceController.updatefavourite.replace('{deviceKey}', deviceData.deviceKey).replace("{isFavourite}", isFavourite);
        Api.Post(url,{}).then(res=>{
            if(res.data){
                if(isFavourite)
                toast.success('Mark favourite');
                else
                toast.success('Unmark favourite');
                setRefresh(Math.random()*100);
            }
        }).catch(err=>{
            toast.error(common.toastMsg.error);
        })
    }
    return (
        <div key={index} className="col-xs-12 col-sm-12 col-md-12 col-lg-4" style={{ paddingTop: 10 + 'px' }}>
            <div className="card text-black mb-3 h-100">
                <div className={deviceData?.status?.toLowerCase() === 'on' ? 'card-header bg-success' : 'card-header bg-danger'}>{deviceData.deviceName + ' - ' + deviceData?.deviceTypeName}
                </div>
                <div className="card-body">
                    {deviceData.deviceTypeName.toLowerCase() == common.deviceType.waterSensor && <WaterSensor deviceData={deviceData} index={index}></WaterSensor>}
                    {deviceData.deviceTypeName.toLowerCase() == common.deviceType.soundSensor && <SoundSensor deviceData={deviceData} index={index}></SoundSensor>}
                    {deviceData.deviceTypeName.toLowerCase() == common.deviceType.moistureSensor && <MoistureSensor deviceData={deviceData} index={index}></MoistureSensor>}
                    {deviceData.deviceTypeName.toLowerCase() == common.deviceType.temperatureSensor && <TemperatureSensor deviceData={deviceData} index={index}></TemperatureSensor>}
                    {deviceData.deviceTypeName.toLowerCase() == common.deviceType.humiditySensor && <HumiditySensor deviceData={deviceData} index={index}></HumiditySensor>}
                    {deviceData.deviceTypeName.toLowerCase() == common.deviceType.ldrSensor && <LDRSensor deviceData={deviceData} index={index}></LDRSensor>}
                    {deviceData.deviceTypeName.toLowerCase() == common.deviceType.gasSensor && <GasSensor deviceData={deviceData} index={index}></GasSensor>}
                    {deviceData.deviceTypeName.toLowerCase() == common.deviceType.motionSensor && <MotionSensor deviceData={deviceData} index={index}></MotionSensor>}
                    {deviceData.deviceTypeName.toLowerCase() == common.deviceType.ultrasonicSensor && <UltrasonicSensor deviceData={deviceData} index={index}></UltrasonicSensor>}
                    {(deviceData.deviceTypeName.toLowerCase() == common.deviceType.lock || deviceData.deviceTypeName.toLowerCase() == common.deviceType.light || deviceData.deviceTypeName.toLowerCase() == common.deviceType.switch || deviceData.deviceTypeName.toLowerCase() == common.deviceType.doorbell) && <Light deviceData={deviceData} index={index}></Light>}

                </div>
                <div className="card-footer">
                    <DeviceControl deviceData={deviceData} setPubMsg={setPubMessage} devicePowerHandler={devicePowerHandler} ></DeviceControl>
                    {deviceData.isAlexaCompatible && <img title="Alexa Compatible" alt="Alexa Compatible" className="assistant-logo" src="/assets/images/alexa.png" />}
                    {deviceData.isGoogleCompatible && <img title="Google Compatible" alt="Google Compatible" className="assistant-logo" src="/assets/images/googleAssistant.png" />}
                    {deviceData.isFavourite && <i title='Unmark favourite' onClick={e=>handleUpdateFavourite('false')} style={{color:'red',cursor:'pointer'}} className="fas fa-heart assistant-logo"></i>}
                    {!deviceData.isFavourite && <i title='Mark favourite' onClick={e=>handleUpdateFavourite("true")} style={{color:'gray',cursor:'pointer'}} className="fas fa-heart-broken assistant-logo"></i>}
                </div>
            </div>
        </div>
    )
}
