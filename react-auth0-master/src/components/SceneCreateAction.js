import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
export default function SceneCreateAction({ deviceData, sceneData, rowIndex, setScene, deviceActionData }) {
    const [isDisable, setIsDisable] = useState([]);
    const [filterActionData, setFilterActionData] = useState([]);
    useEffect(() => {
        let disableArray = isDisable;
        if(sceneData.sceneActions[rowIndex].device && sceneData.sceneActions.length>0)
        {
            setFilterActionData(deviceActionData[sceneData.sceneActions[rowIndex].device.deviceType.deviceTypeName]);
        }
      let d=  sceneData?.sceneActions?.forEach((element, ind) => {
            if (disableArray.length - (ind + 1) >= 0) {
                disableArray.push(true);
            }
        });
        setIsDisable(disableArray);
    }, [sceneData]);
    const handleRemove = (e) => {
        if (sceneData.sceneActions.length > 1) {
            sceneData.sceneActions.splice(rowIndex, 1);
            setScene({ ...sceneData });
        }
        else {
            toast.warn("Can't remove last row.");
        }
    }
    const handleChange = (e, type) => {
        debugger;
        if (e.target.name === "deviceId") {
            var selectedDeviceType = e.target.childNodes[e.target.selectedIndex].getAttribute('data-deviceTypeName');
            setFilterActionData(deviceActionData[selectedDeviceType]);
        }
        if (e.target.name === "action") { 
            sceneData.sceneActions[rowIndex].value = e.target.childNodes[e.target.selectedIndex].getAttribute('data-deviceactionvalue');
            setIsDisable(true);
        }
        sceneData.sceneActions[rowIndex][e.target.name] = type === 'int' ? parseInt(e.target.value.split("||")[0]) : e.target.value.split("||")[0];
        setScene({ ...sceneData });
    }
    return (
        <tr>
            <td>{rowIndex + 1}</td>
            <td>
                <select name="deviceId" value={sceneData.sceneActions[rowIndex].deviceId} onChange={e => handleChange(e, 'int')} key={sceneData.sceneActions[rowIndex].deviceId} className="form-control">
                    <option value="">Select Device</option>
                    {
                        deviceData.map((ele) => {
                            return <option key={ele.deviceId} data-devicetypename={ele.deviceTypeName} value={ele.deviceId}>{ele.deviceName}</option>
                        })
                    }
                </select>
            </td>
            <td>
                <select name="action" value={sceneData.sceneActions[rowIndex].action} onChange={e => handleChange(e)} className="form-control">
                    <option value="">Select Action</option>
                    {
                        filterActionData.map((ele) => {
                            return <option key={ele.deviceActionValue} data-deviceactionvalue={ele.deviceActionValue} value={ele.deviceActionName}>{ele.deviceActionName}</option>
                        })
                    }
                </select>
            </td>
            <td>
                <input name="value" className="form-control" disabled={isDisable ? 'disable' : ''} value={sceneData.sceneActions[rowIndex].value} onChange={e => handleChange(e)} type="text" />
            </td>
            <td>
                <button type="button" onClick={e => handleRemove(e)} className="btn btn-danger"><i className="fas fa-minus"></i></button>
            </td>
        </tr>
    )
}
