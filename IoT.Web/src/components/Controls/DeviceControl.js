import React, { useState,useEffect } from 'react'
import { toast } from 'react-toastify';
import { common } from "../../Configurations/common";
import '../../css/deviceControl.css';
export default function DeviceControl({ devicePowerHandler, deviceData, setPubMsg }) {
    const [isOn, setIsOn] = useState(false);
    useEffect(() => {
        debugger;
       setIsOn(deviceData?.status?.toLowerCase() === 'on');
    }, [deviceData.status])
    const [publishData, setPublishData] = useState({
        brightness: 100,
        saturation: 100,
        color: '',
        timer: 0
    });
    const deviceTypeName = deviceData?.deviceTypeName.toLowerCase();
    function handleChange(e) {
        setPublishData({ ...publishData, [e.target.name]: e.target.value });
        let localData = common.getStorePubData();
        localData = !common.hasValue(localData) ? [] : localData;
        var hasDeviceId = false;
        localData.forEach((ele, ind) => {
            if (ele.deviceId === deviceData?.deviceKey) {
                hasDeviceId = true;
                ele.action = common.getCommandObj(e.target.name, e.target.value).action;
                ele.topic = common.getApiKey();
                ele.value = common.getCommandObj(e.target.name, e.target.value).value;
                setPubMsg(ele);
            }
        })
        if (!hasDeviceId) {
            setPubMsg({
                deviceId: deviceData?.deviceKey,
                action: common.getCommandObj(e.target.name, e.target.value).action,
                topic: common.getApiKey(),
                value: common.getCommandObj(e.target.name, e.target.value).value
            });
        }
    }
    function handleDeviceOnOff(value, deviceKey) {
        if (!common.hasValue(deviceData?.ip)) {
            toast.warn('Device isn\'t connected');
        }
        else {
            devicePowerHandler(value, deviceKey);
        }
    }
    function getDeviceTyoe() {
        return {
            isLight: deviceTypeName?.toLowerCase().indexOf('light') > -1,
            isStrip: deviceTypeName?.toLowerCase().indexOf('strip') > -1,
            isDoorbell: deviceTypeName?.toLowerCase().indexOf('doorbell') > -1,
            isSwitch: deviceTypeName?.toLowerCase().indexOf('switch') > -1
        }
    }
    function isDeviceOn() {
        return deviceData?.status?.toLowerCase() === 'on';
    }

    function getButton() {
        if (getDeviceTyoe().isDoorbell)
            return <div className="d-inline-flex p-2 bd-highlight"><button disabled={!common.hasValue(deviceData?.ip)} className="btn btn-success btn-sm" onClick={e => handleDeviceOnOff("PRESS", deviceData?.deviceKey)}>Press Bell</button></div>
        else if (getDeviceTyoe().isLight || getDeviceTyoe().isStrip || getDeviceTyoe().isSwitch) {
            if (!common.hasValue(deviceData?.deviceStatus))
                return <>
                    <div className="d-inline-flex p-2 bd-highlight"><button disabled={!common.hasValue(deviceData?.ip)} className={isOn ? "btn btn-danger btn-sm" : "btn btn-success btn-sm"} onClick={e => handleDeviceOnOff(isOn, deviceData?.deviceKey)}><i className="fas fa-power-off"></i></button></div>
                </>
        }
    }
    function getSettingButton() {
        if (getDeviceTyoe().isLight || getDeviceTyoe().isStrip) {
            return <div className="d-inline-flex p-2 bd-highlight"><button disabled={!common.hasValue(deviceData?.ip)} type="button" className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target={"#id" + deviceData?.deviceKey}><i className="fas fa-ellipsis-v"></i></button></div>
        }
    }
    // if(!common.hasValue(deviceStatus))
    // {
    //     return <></>
    // }
    return (
        <>
            {getButton()}
            {getSettingButton()}
            <div className="modal fade" id={'id' + deviceData?.deviceKey} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{deviceData.deviceName + ' - ' + deviceData?.deviceTypeName}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                deviceData?.deviceTypeName.toLowerCase() === 'light' &&
                                (
                                    <>
                                        <div>
                                            <span>Brightness</span><span className="float-end sublabel">{publishData.brightness}</span>
                                            <input type="range" onChange={e => handleChange(e)} value={publishData.brightness} name="brightness" className="form-range" step="4" min="0" max="100" id="Brightness" />
                                        </div>
                                        <div>
                                            <span>Saturation</span><span className="float-end sublabel">{publishData.saturation}</span>
                                            <input onChange={e => handleChange(e)} value={publishData.saturation} name="saturation" type="range" className="form-range" step="4" min="0" max="100" id="Saturation" />
                                        </div>
                                        <div>
                                            <span>Timer</span><span className="float-end sublabel">{publishData.timer}</span>
                                            <input type="range" onChange={e => handleChange(e)} value={publishData.timer} name="timer" className="form-range" step=".1" min="0.001" max="100" id="Brightness" /> <input type="text" onChange={e => handleChange(e)} value={publishData.timer} name="timer" className="form-range" id="Brightness" />
                                        </div>
                                        <label htmlFor="exampleColorInput" className="form-label">Color picker</label>
                                        <input onChange={e => handleChange(e)} value={publishData.color} name="color" type="color" className="form-control form-control-color" id="exampleColorInput" title="Choose your color" />
                                        {
                                            publishData.color
                                        }
                                    </>
                                )
                            }
                            {
                                deviceData?.deviceTypeName.toLowerCase().indexOf('strip') > -1 &&
                                (
                                    <>
                                        <div>
                                            <span>Brightness</span><span className="float-end sublabel">{publishData.brightness}</span>
                                            <input type="range" onChange={e => handleChange(e)} value={publishData.brightness} name="brightness" className="form-range" step="4" min="0" max="100" id="Brightness" />
                                        </div>
                                        <div>
                                            <span>Timer</span><span className="float-end sublabel">{publishData.timer}</span>
                                            <input type="range" onChange={e => handleChange(e)} value={publishData.timer} name="timer" className="form-range" step=".1" min="0.001" max="100" id="Brightness" /> <input type="text" onChange={e => handleChange(e)} value={publishData.timer} name="timer" className="form-range" id="Brightness" />
                                        </div>
                                        <div>
                                            <span>Saturation</span><span className="float-end sublabel">{publishData.saturation}</span>
                                            <input onChange={e => handleChange(e)} value={publishData.saturation} name="saturation" type="range" className="form-range" step="4" min="0" max="100" id="Saturation" />
                                        </div>
                                        <label htmlFor="exampleColorInput" className="form-label">Color picker</label>
                                        <input onChange={e => handleChange(e)} value={publishData.color} name="color" type="color" className="form-control form-control-color" id="exampleColorInput" title="Choose your color" />
                                        {
                                            publishData.color
                                        }
                                    </>
                                )
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
