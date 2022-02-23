import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Api } from "../Configurations/Api";
import {  } from "../Configurations/apiUrl.json";
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import Loader from './Loader';
import {  common} from "../Configurations/common";
import ConfirmationBox from './Controls/ConfirmationBox';
export default function Credentials() {
    const breadcrumbOption = [{ name: 'Home', link: "/Dashboard", isActive: true }, { name: 'Credentials', link: "", isActive: false }]
    const [credData, setCredData] = useState({});
    const [loadingData, setLoadingData] = useState(common.getDefault(common.dataType.bool));
    const apiUrlData = require('../Configurations/apiUrl.json');
    const handleResetApiKey = (e) => {
        setLoadingData(true);
        Api.Get(apiUrlData.userController.resetApiKey).then(res => {
            setLoadingData(false); console.table(res.data);
            setCredData(res.data);
            toast.success("API Key Reset successfully.");
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }
    useEffect(() => {
        setLoadingData(true);
        Api.Get(apiUrlData.userController.getApiKey).then(res => {
            debugger;
        setCredData(res.data);
        setLoadingData(false)
    }).catch(err=>{
        setLoadingData(false);
        toast.error(common.toastMsg.error);
      });
    }, []);
    let conBoxOption = {
        modelBoxId: "exampleModalResetAPIKey",
        deleteHandler: handleResetApiKey,
        title:"Reset Confirmation",
        actionButtonText:'Reset Key',
        msg:"After Resetting the API key your all connect device(s) will stop working! Are you sure?"
    }
    return (
        <div className="page-container">
            {
                loadingData && <Loader></Loader>
            }            
        <Breadcrumb option={breadcrumbOption}></Breadcrumb>
        <ConfirmationBox options={conBoxOption}></ConfirmationBox>
            <div className="d-flex justify-content-between bd-highlight mb-3">
                <div className="p-2 bd-highlight">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" data-bs-toggle="modal" data-bs-target={"#exampleModalResetAPIKey"} className="btn btn-primary"><i className="fa fa-plus"></i>  New API Key</button>
                    </div>
                </div>
                <div className="p-2 "><p className="h4">Credentials</p></div>
                <div className="p-2 bd-highlight">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Search API Key" aria-label="Search API Key" aria-describedby="button-addon2" />
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2"><i className="fa fa-search"></i></button>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">API KEY</th>
                            <th scope="col">Created On</th>
                        </tr>
                    </thead>
                    <tbody><tr>
                        <th scope="row">1</th>
                        <td>{credData.apiKey?.substring(0, credData.apiKey.length - 20) + credData.apiKey?.substring(credData.apiKey.length - 20, credData.apiKey.length).replace(/[a-z\d]/gi, "#")}
                         <i title="Copy API Key" onClick={e=>common.copyToClipboard(credData.apiKey)} className="fas fa-copy id-copy"></i></td>
                        <td>{credData.modifiedDate?.substring(0, 10)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
