import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import { common } from "../Configurations/common";
export default function Account() {
    const [loadingData, setLoadingData] = useState(true);
    const apiUrlData = require('../Configurations/apiUrl.json');
    const [accountData, setAccountData] = useState({
        "language": '',
        "email": '',
        "name": '',
        "firstName": '',
        "lastName": '',
        "temperature": '',
        "timezone": ''
    });
    useEffect(() => {
            setLoadingData(true);
            Api.Get(apiUrlData.userController.getUser).then(res => {
                res.data['name'] = res.data.firstName + ' ' + res.data.lastName;
                setAccountData(res.data);
                setLoadingData(false);
            }).catch(err => {
                setLoadingData(false);
                toast.error(common.toastMsg.error);
            });
    }, []);

    const inputHandler = (e, dataType) => {
        var val = dataType !== undefined && dataType.toLowerCase() === "int" ? Number(e.target.value) : e.target.value;
        setAccountData({ ...accountData, [e.target.name]: val });
    };
    const handleSubmit = () => {
        if (accountData.email.length < 1) {
            toast.error("Fill email field.");
            return;
        }
        if (accountData.name.length < 3) {
            toast.error("Fill user name.");
            return;
        }
        if (accountData.language === undefined || accountData.language === null || accountData.language === "") {
            toast.error("Please select language.");
            return;
        }
        if (accountData.temperature === undefined || accountData.temperature === null || accountData.temperature === "") {
            toast.error("Please select temperature unit.");
            return;
        }
        if (accountData.timezone === undefined || accountData.timezone === null || accountData.timezone === "") {
            toast.error("Please select timezone.");
            return;
        }
        Api.Post(apiUrlData.userController.updateUser, accountData).then(res => {
            toast.success("Account is updated.");
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    return (
        <div className="page-container">
            {loadingData && (<Loader></Loader>)}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Account</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-header bg-primary bg-gradient">
                            <h6 className="card-title">Accout Details</h6>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name<strong className="text-danger">*</strong></label>
                                    <input type="text" disabled="disabled" name="name" value={accountData.firstName + ' ' + (accountData.lastName === undefined ? '' : accountData.lastName)} className="form-control" id="txtName" aria-describedby="txtNameHelp" />
                                    <div id="txtNameHelp" className="form-text">User full name</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email<strong className="text-danger">*</strong></label>
                                    <input type="email" disabled="disabled" name="email" value={accountData.email} className="form-control" id="txtEmail" aria-describedby="txtEmailHelp" />
                                    <div id="txtEmailHelp" className="form-text">User email address</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ddlLanguage" className="form-label">Language<strong className="text-danger">*</strong></label>
                                    <select name="language" onChange={e => inputHandler(e)} value={accountData.language} className="form-control" id="ddlLanguage" aria-describedby="ddlLanguageHelp">
                                        <option value="">Select Language</option>
                                        <option value="en-US">EN-US</option>
                                        <option value="en-UK">EN-UK</option>
                                        <option value="en-GB">EN-GB</option>
                                    </select>
                                    <div id="ddlLanguageHelp" className="form-text">Select language</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ddlTemperature" className="form-label">Temperature<strong className="text-danger">*</strong></label>
                                    <select name="temperature" onChange={e => inputHandler(e)} value={accountData.temperature} className="form-control" id="ddlTemperature" aria-describedby="ddlTemperatureHelp">
                                        <option value="">Select Temperature</option>
                                        <option value="Celcius">Celcius</option>
                                        <option value="Farenheit">Farenheit</option>
                                    </select>
                                    <div id="ddlTemperatureHelp" className="form-text">Select temperature unit</div>

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ddlTimezone" className="form-label">Timezone<strong className="text-danger">*</strong></label>
                                    <select name="timezone" onChange={e => inputHandler(e)} value={accountData.timezone} className="form-control" id="ddlTimezone" aria-describedby="ddlTimezoneHelp">
                                        <option value="">Select Timezone</option>
                                        <option value="GMT +5.30">GMT +5.30</option>
                                        <option value="GMT">GMT</option>
                                    </select>
                                    <div id="ddlTimezoneHelp" className="form-text">Select timezone</div>
                                </div>

                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">Submit</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}
