import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from './Loader';

export default function Scenes() {
    const [sceneData, setSceneData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [searchTerm, setsearchTerm] = useState("All");
    const apiUrlData = require('../Configurations/apiUrl.json');
        
    const handleDelete=(e)=>
    {
        var val=e.target.value?e.target.value:e.target.dataset.scenekey;
        setLoadingData(true);
        Api.Delete(apiUrlData.sceneController.deleteScene+'?scenekey='+val).then(res => {          
            setLoadingData(false);
            setsearchTerm("All");
            handleSerach();
            toast.success("Scene Deleted.")
        })
    }
    const handleSerach = (e) => {
        debugger;
        if (searchTerm !=="All" && (searchTerm === "" || searchTerm.length<3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.sceneController.searchScene + '?searchterm=' + searchTerm).then(res => {
            setSceneData(res.data);
            setLoadingData(false)
        })
    }
    useEffect(() => {
        async function getData() {
            await Api.Get(apiUrlData.sceneController.getAllScene).then(res => {
                setSceneData(res.data);
                setLoadingData(false)
            }).catch(xx=>{
                toast.error('Something went wrong');
            })
        }
        if (loadingData) {
            getData();
        }
    }, [loadingData,apiUrlData.sceneController.getAllScene]);

    return (
        <div className="page-container">
        {
            loadingData && <Loader></Loader>
        }
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Scenes</li>
            </ol>
        </nav>

        <div className="d-flex justify-content-between bd-highlight mb-3">
            <div className="p-2 bd-highlight">
                <div className="btn-group" role="group" aria-label="Basic example">
                    <Link to="/SceneCreate"><div className="btn btn-sm btn-outline-primary"><i className="fa fa-plus"></i> Add</div></Link>
                    <button type="button" className="btn btn-sm btn-outline-primary"><i className="fa fa-sync-alt"></i></button>
                </div>
            </div>
            <div className="p-2 "><p className="h5">Scenes</p></div>
            <div className="p-2 bd-highlight">
                <div className="input-group mb-3">
                    <input type="text" value={searchTerm} onChange={e => setsearchTerm(e.target.value)} className="form-control form-control-sm" placeholder="Search Room" aria-label="Search Devices" aria-describedby="button-addon2" />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSerach}><i className="fa fa-search"></i></button>
                </div>
            </div>
        </div>
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Scene</th>
                        <th scope="col">Description</th>
                        <th scope="col">Test Scene</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sceneData && sceneData.length===0 && (
                        <tr>
                        <td  className="text-center" colSpan="5">No Data Found</td>
                        </tr>
                    )
                    }
                    {
                        sceneData && (sceneData.map((ele, ind) => {
                            return (
                                <tr key={ele.roomId}>
                                    <td >{ind + 1}</td>
                                    <td>{ele.sceneName}</td>
                                    <td>{ele.sceneDesc}</td>
                                    <td> <button type="button" value={ele.sceneKey}  className="btn btn-sm btn-outline-primary"><i data-scenekey={ele.sceneKey} className="fa fa-trash"></i>Test Scene</button></td>
                                    <td>
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <Link to={"/SceneCreate?scenekey="+ele.sceneKey}><div className="btn btn-sm btn-outline-success"><i className="fas fa-pencil-alt" aria-hidden="true"></i></div></Link>
                                            <button type="button" value={ele.sceneKey} onClick={e=>handleDelete(e)} className="btn btn-sm btn-outline-danger"><i data-scenekey={ele.sceneKey} className="fa fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }))
                    }
                </tbody>
            </table>
        </div>
    </div>

    )
}
