import React, { useState,useEffect } from 'react'
import { toast } from 'react-toastify';
export default function SceneCreateAction({ deviceData, sceneData, rowIndex, setScene }) {
    const [isDisable, setIsDisable] = useState([]);
    useEffect(() => {
        let disableArray = isDisable;
          let d=  sceneData?.sceneActions?.forEach((element,ind) => {
                if (disableArray.length - (ind+1) >= 0) {
                    disableArray.push(true);
                }
            });
            setIsDisable(disableArray);
    }, [sceneData]);
    const actionTypeData = {
        Switch: ['TurnOn', 'TurnOff'],
        Light: ['TurnOn', 'TurnOff'],
        MotionSenser: ['TurnOn', 'TurnOff'],
        SmartLight: ['TurnOn', 'TurnOff', "Brigthness", 'Color'],
    }
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
        sceneData.sceneActions[rowIndex][e.target.name] = type === 'int' ? parseInt(e.target.value) : e.target.value;
        setScene({ ...sceneData });
    }
    return (
        <tr>
            <td>{rowIndex+1}</td>
            <td>
                <select name="deviceId" value={sceneData.sceneActions[rowIndex].deviceId} onChange={e => handleChange(e, 'int')} key={sceneData.sceneActions[rowIndex].deviceId} className="form-control">
                    <option value="">Select Device</option>
                    {
                        deviceData.map((ele) => {
                            return <option key={ele.deviceId} value={ele.deviceId}>{ele.deviceName}</option>
                        })
                    }
                </select>
            </td>
            <td>
                <select name="action" value={sceneData.sceneActions[rowIndex].action} onChange={e => handleChange(e)} className="form-control">
                    <option value="">Select Action</option>
                    {
                        actionTypeData['Switch'].map((ele) => {
                            return <option key={ele} value={ele}>{ele}</option>
                        })
                    }
                </select>
            </td>
            <td>
                <input name="value" className="form-control" disabled={isDisable[rowIndex] ? 'disable' : ''} value={sceneData.sceneActions[rowIndex].value} onChange={e => handleChange(e)} type="text" />
            </td>
            <td>
                <button type="button" onClick={e => handleRemove(e)} className="btn btn-danger"><i className="fas fa-minus"></i></button>
            </td>
        </tr>
    )
}
