import React from 'react'
import { common } from "../../Configurations/common";
import DeviceControl from '../Controls/DeviceControl';
import GasSensor from './GasSensor';
import Light from './Light';
import UltrasonicSensor from './UltrasonicSensor';
export default function DeviceCard({ deviceData, index, devicePowerHandler, setPubMessage }) {
    return (
        <div key={index} className="col-xs-12 col-sm-12 col-md-12 col-lg-4" style={{ paddingTop: 10 + 'px' }}>
            <div className="card text-black mb-3 h-100">
                <div className={deviceData?.status?.toLowerCase() === 'on' ? 'card-header bg-success' : 'card-header bg-danger'}>{deviceData.deviceName + ' - ' + deviceData?.deviceTypeName}</div>
                <div className="card-body">
                    { deviceData.deviceTypeName.toLowerCase() == common.deviceType.gasSensor && <GasSensor deviceData={deviceData} index={index}></GasSensor>}
                    { deviceData.deviceTypeName.toLowerCase() == common.deviceType.ultrasonicSensor && <UltrasonicSensor deviceData={deviceData} index={index}></UltrasonicSensor>}
                    { (deviceData.deviceTypeName.toLowerCase() == common.deviceType.lock ||deviceData.deviceTypeName.toLowerCase() == common.deviceType.motionSensor ||deviceData.deviceTypeName.toLowerCase() == common.deviceType.light || deviceData.deviceTypeName.toLowerCase() == common.deviceType.switch || deviceData.deviceTypeName.toLowerCase() == common.deviceType.doorbell) && <Light deviceData={deviceData} index={index}></Light>}
                            
                </div>
                <div className="card-footer">
                    <DeviceControl deviceData={deviceData} setPubMsg={setPubMessage} devicePowerHandler={devicePowerHandler} ></DeviceControl>
                </div>
            </div>
        </div>
    )
}
