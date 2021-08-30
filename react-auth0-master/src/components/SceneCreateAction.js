import React from 'react'

export default function SceneCreateAction({deviceData,sceneData,rowIndex,setScene}) {
    debugger;
    const actionTypeData={
        Switch:['TurnOn','TurnOff'],
        Light:['TurnOn','TurnOff'],
        MotionSenser:['TurnOn','TurnOff'],
        SmartLight:['TurnOn','TurnOff',"Brigthness",'Color'],
    }
    const handleAdd=(e)=>{
        debugger;
        sceneData.sceneAction.push({
            deviceId:'',
            sceneAction:'',
            value:''
        });
        setScene(sceneData);
    }
    return (
       <tr>
           <td>1</td>
           <td>
               <select key={sceneData.sceneAction[rowIndex].deviceId} value={sceneData.sceneAction[rowIndex].deviceId} onChange={e=>setScene(sceneData)} className="form-control">
                   <option value="">Select Device</option>
                   {
                       deviceData.map((ele)=>{
                           return <option key={ele.deviceId} value={ele.deviceId}>{ele.deviceName}</option>
                       })
                   }
               </select>
           </td>
           <td>
               <select value={sceneData.sceneAction[rowIndex].sceneAction} onChange={e=>setScene(sceneData)} className="form-control">
                   <option value="">Select Action</option>
                   {
                       actionTypeData['Switch'].map((ele)=>{
                           return <option key={ele} value={ele}>{ele}</option>
                       })
                   }
               </select>
           </td>
           <td>
               <input className="form-control" value={sceneData.sceneAction[rowIndex].value} onChange={e=>setScene(sceneData)} type="text" />
           </td>
           <td>
               <i className="fas fa-plus" onClick={e=>handleAdd(e)}></i>
           </td>
       </tr>
    )
}
