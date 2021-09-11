import React, { useState } from 'react'
import { common } from "../../Configurations/common";
import '../../css/deviceControl.css';
export default function DeviceControl({ devicePowerHandler, deviceData }) {
    const [publishData, setPublishData] = useState({
        brightness: 100,
        saturation: 100,
        color: ''
    });
    function handleChange(e) {
        setPublishData({ ...publishData, [e.target.name]: e.target.value });
        let actionName = '';
        switch (e.target.name) {
            case 'brightness':
                actionName = 'setBrightness'
                break;
            case 'saturation':
                actionName = 'setSaturation'
                break;
            case 'color':
                actionName = 'setColor'
                break;
            default:
                break;
        }
        let localData = common.getStorePubData();
        localData = !common.hasValue(localData) ? [] : localData;
        localData.push({
            deviceId: deviceData?.deviceKey,
            action: actionName,
            topic: window.iotGlobal.apiKey,
            value: e.target.value
        });
        common.setStorePubData(localData);
    }
    // if(!common.hasValue(deviceStatus))
    // {
    //     return <></>
    // }
    return (
        <>
            {deviceData?.deviceTypeName.toLowerCase().indexOf('doorbell')>-1 &&  <div className="d-inline-flex p-2 bd-highlight"><button className="btn btn-success btn-sm" onClick={e => devicePowerHandler("PRESS", deviceData?.deviceKey)}>Press Bell</button></div>}
            {(deviceData?.deviceStatus === undefined || deviceData?.deviceStatus?.toLowerCase() === 'off') && <div className="d-inline-flex p-2 bd-highlight"><button className="btn btn-success btn-sm" onClick={e => devicePowerHandler("ON", deviceData?.deviceKey)}>Turn On</button></div>}
            {(deviceData?.deviceStatus === undefined || deviceData?.deviceStatus?.toLowerCase() === 'on') && <div className="d-inline-flex p-2 bd-highlight"><button className="btn btn-danger  btn-sm" onClick={e => devicePowerHandler("OFF", deviceData?.deviceKey)}>Turn Off</button></div>}
            <div className="d-inline-flex p-2 bd-highlight"><button type="button" className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target={"#id" + deviceData?.deviceKey}><i className="fas fa-ellipsis-v"></i></button></div>
            <div className="modal fade" id={'id' + deviceData?.deviceKey} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                        <label for="exampleColorInput" className="form-label">Color picker</label>
                                        <input onChange={e => handleChange(e)} value={publishData.color} name="color" type="color" className="form-control form-control-color" id="exampleColorInput" value="#563d7c" title="Choose your color" />
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
