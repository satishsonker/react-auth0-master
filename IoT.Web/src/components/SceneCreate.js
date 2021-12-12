import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "./Loader";
import SceneCreateAction from './SceneCreateAction';
import { common } from "../Configurations/common";
import Unauthorized from './CustomView/Unauthorized';

export default function SceneCreate({ userRole }) {
    const sceneTemplate = {
        sceneName: '',
        sceneDesc: '',
        sceneActions: [{
            deviceId: 0,
            action: '',
            value: ''
        }]
    };
    const apiUrlData = require('../Configurations/apiUrl.json');
    const [isSceneUpdating, setIsSceneUpdating] = useState(common.getDefault(common.dataType.bool));
    const [isSceneCreated, setIsSceneCreated] = useState(common.getDefault(common.dataType.bool));
    const [loadingData, setLoadingData] = useState(true);
    const [deviceTypeActionData, setDeviceTypeActionData] = useState([]);
    const [deviceData, setDeviceData] = useState([{
        deviceName: 'Test',
        deviceKey: 'AAKDADGJ7648998DKDAK76334',
        deviceId: 0
    }])
    const [scene, setScene] = useState(sceneTemplate);

    useEffect(() => {
        let sceneKey = common.queryParam(window.location.search)?.scenekey;
        sceneKey = !common.hasValue(sceneKey) ? '' : sceneKey;
        async function getDeviceDropdown() {
            let promises = [];
            promises.push(Api.Get(apiUrlData.deviceController.getDeviceDropdown));
            promises.push(Api.Get(apiUrlData.deviceController.getDeviceTypeAction));
            Api.MultiCall(promises).then(res => {
                setLoadingData(false);
                if (res.length > 0) {
                    setDeviceData(res[0].data);
                    let filteredDeviceData = {};
                    res[1].data.filter((ele) => {
                        filteredDeviceData[ele.deviceTypeName] = [];
                        ele.deviceActions.filter((eleInner) => {
                            filteredDeviceData[ele.deviceTypeName].push({
                                deviceActionName: eleInner.deviceActionName,
                                deviceActionNameBackEnd: eleInner.deviceActionNameBackEnd,
                                deviceActionValue: eleInner.deviceActionValue
                            });
                        });
                    })
                    setDeviceTypeActionData(filteredDeviceData);
                    setLoadingData(false)
                }
            }).catch(err=>{
                setLoadingData(false);
                toast.error(common.toastMsg.error);
              });;
        } if (sceneKey !== "") {
            setIsSceneUpdating(true);
            setLoadingData(true);
            Api.Get(apiUrlData.sceneController.getScene + '?scenekey=' + sceneKey).then(res => {
                setScene(res.data);
                setLoadingData(false);
            }).catch(err=>{
                setLoadingData(false);
                toast.error(common.toastMsg.error);
              });
        }
        getDeviceDropdown();
    }, [loadingData, apiUrlData.sceneController.getScene]);

    const inputHandler = (e) => {
        setScene({ ...scene, [e.target.name]: e.target.value });
    };
    const handleSubmit = () => {
        if (scene.sceneName.length < 1) {
            toast.warn("Please enter scene name.");
            return;
        }
        else if (scene.sceneName.length < 3) {
            toast.warn("Scene name should be min 3 char.");
            return;
        }
        if (scene.sceneActions) {
            let isValid = true;
            scene.sceneActions.forEach((element, ind) => {
                if (isNaN(element.deviceId)) {
                    toast.warn("Please select the device in row number " + (ind + 1));
                    isValid = false;
                }
                if (element.action === "") {
                    toast.warn("Please select the action in row number " + (ind + 1));
                    isValid = false;
                }
            });
            if (!isValid)
                return;
        }
        Api.Post(!isSceneUpdating ? apiUrlData.sceneController.addScene : apiUrlData.sceneController.updateScene, scene).then(res => {
            toast.success(!isSceneUpdating ? "Scene is created" : "Scene is updated");
            setIsSceneCreated(true);
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }
    const handleAdd = (e) => {
        scene.sceneActions.push({
            deviceId: '',
            action: '',
            value: ''
        });
        setScene({ ...scene });
    }
    if (!userRole?.canView)
        return <Unauthorized></Unauthorized>
    if (loadingData)
        return <Loader></Loader>
    return (
        <div className="page-container">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/Scenes">Scenes</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{!isSceneUpdating ? 'Add ' : 'Update '} Scene</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-header bg-primary bg-gradient">
                            <h6 className="card-title">{!isSceneUpdating ? 'Add ' : 'Update '}  Scenes</h6>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="txtSceneName" className="form-label">Scene Name<strong className="text-danger">*</strong></label>
                                    <input type="text" name="sceneName" value={scene?.sceneName} onChange={e => inputHandler(e)} className="form-control" id="txtSceneName" aria-describedby="txtSceneNameHelp" />
                                    <div id="txtSceneNameHelp" className="form-text">Enter the desire scene name</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtSceneDesc" className="form-label">Scene Description</label>
                                    <textarea name="sceneDesc" value={scene?.sceneDesc} onChange={e => inputHandler(e)} className="form-control" id="txtSceneDesc" aria-describedby="txtSceneDescHelp" />
                                    <div id="txtSceneDescHelp" className="form-text">Enter the desire scene description</div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Device</th>
                                                <th scope="col">Action</th>
                                                <th scope="col">Value</th>
                                                <th scope="col"> <i className="fas fa-plus" onClick={e => handleAdd(e)}></i></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                scene?.sceneActions?.map((ele, ind) => {
                                                    return <SceneCreateAction key={ind} deviceData={deviceData} rowIndex={ind} setScene={setScene} sceneData={scene} deviceActionData={deviceTypeActionData}></SceneCreateAction>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                {((userRole?.canCreate && !isSceneUpdating) || (userRole?.canUpdate && isSceneUpdating)) && <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isSceneUpdating ? 'Add ' : 'Update '} Scene</button>}
                                {isSceneCreated && (
                                    <Redirect to="/scenes"></Redirect>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
