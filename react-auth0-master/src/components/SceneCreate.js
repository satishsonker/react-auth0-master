import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "./Loader";
import SceneCreateAction from './SceneCreateAction';

export default function SceneCreate() {
    debugger;
    toast.configure();
    const { user } = useAuth0();
    const sceneTemplate={
        sceneName: '',
        sceneDesc: '',
        sceneAction: [{}]
    };
    const apiUrlData = require('../Configurations/apiUrl.json');
    const [isSceneUpdating, setIsSceneUpdating] = useState(false);
    const [isSceneCreated, setIsSceneCreated] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [deviceData,setDeviceData]=useState([{
        deviceName:'Test',
        deviceKey:'AAKDADGJ7648998DKDAK76334',
        deviceId:0
    }])
    const [scene, setScene] = useState(sceneTemplate);
    function queryParam(params) {
        console.log(params);
        if (params === undefined || params === "" || params === null) {
            return {};
        }
        params = "{\"" +
            params
                .replace(/\?/gi, "")
                .replace(/&/gi, "\",\"")
                .replace(/=/gi, "\":\"") +
            "\"}";

        params = JSON.parse(params);
        return params
    }
    useEffect(() => {
        let sceneKey = queryParam(window.location.search)?.scenekey;
        sceneKey = sceneKey === undefined || sceneKey === null ? '' : sceneKey;
        async function getDeviceDropdown() {
            await Api.Get(apiUrlData.deviceController.getDeviceDropdown ).then(res => {
                setDeviceData(res.data);
                setLoadingData(false)
            }).catch(xx => {
                toast.error('Something went wrong');
            })
        }
        async function getData() {
            await Api.Get(apiUrlData.sceneController.getScene + '?scenekey=' + sceneKey).then(res => {
                setScene(res.data);
                setLoadingData(false)
            }).catch(xx => {
                toast.error('Something went wrong');
            });
        }
        if (!loadingData) {
            if (sceneKey !== "") {
                setIsSceneUpdating(true);
                getData();
            }
            getDeviceDropdown()
        }
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
        Api.Post(!isSceneUpdating ? apiUrlData.sceneController.addScene : apiUrlData.sceneController.updateScene, scene).then(res => {
            toast.success(!isSceneUpdating ? "Scene is created" : "Scene is updated");
            setIsSceneCreated(true);
        }).catch(ee => {
            toast.error("Something went wrong !");
        });
    }
    return (
        <div className="page-container">
            {loadingData && (<Loader></Loader>)}
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
                                                <th scope="col">Add/Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                
                                                scene?.sceneAction.map((ele,ind)=>{                                                    
                                                    return <SceneCreateAction key={ind} deviceData={deviceData} rowIndex={ind} setScene={setScene} sceneData={scene}></SceneCreateAction>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isSceneUpdating ? 'Add ' : 'Update '} Scene</button>
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
