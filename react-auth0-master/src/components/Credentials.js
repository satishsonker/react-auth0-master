import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Api } from "../Configurations/Api";
import {  } from "../Configurations/apiUrl.json";
import { toast } from 'react-toastify';
import Loader from './Loader';
export default function Credentials() {
    const [credData, setCredData] = useState({});
    const [loadingData, setLoadingData] = useState(true);
    const apiUrlData = require('../Configurations/apiUrl.json');
    const copyToClipboard = (val) => {
        const el = document.createElement('textarea');
        el.value = val;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
    const handleResetApiKey = (e) => {
        setLoadingData(true);
        Api.Get(apiUrlData.userController.resetApiKey).then(res => {
            setLoadingData(false); console.table(res.data);
            setCredData(res.data);
            toast.success("API Key Reset successfully.");
        }).catch(xx => {
            toast.error("Something went wrong.");
        });
    }
    useEffect(() => {
        async function getData() {
            await Api.Get(apiUrlData.userController.getApiKey).then(res => {
                setCredData(res.data);

                setLoadingData(false)
            }).catch(xx => {
                toast.error('Something went wrong');
            })
        }
        if (loadingData) {
            getData();
        }
    }, [loadingData, apiUrlData.userController.getApiKey]);
    return (
        <div className="page-container">
            {
                loadingData && <Loader></Loader>
            }
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li class="breadcrumb-item active" aria-current="page">Credentials</li>
                </ol>
            </nav>
            <div class="d-flex justify-content-between bd-highlight mb-3">
                <div class="p-2 bd-highlight">
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-primary" onClick={e => handleResetApiKey()}><i class="fa fa-plus"></i>  New API Key</button>
                    </div>
                </div>
                <div class="p-2 "><p class="h4">Credentials</p></div>
                <div class="p-2 bd-highlight">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Search Devices" aria-label="Search Devices" aria-describedby="button-addon2" />
                        <button class="btn btn-outline-secondary" type="button" id="button-addon2"><i class="fa fa-search"></i></button>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table">
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
                         <i title="Copy API Key" onClick={e=>copyToClipboard(credData.apiKey)} className="fas fa-copy id-copy"></i></td>
                        <td>{credData.modifiedDate?.substring(0, 10)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
