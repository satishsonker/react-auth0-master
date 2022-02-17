import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { common } from '../../Configurations/common';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import AddUpdateButton from '../Buttons/AddUpdateButton';
import { Api } from "../../Configurations/Api";
import Unauthorized from '../CustomView/Unauthorized';
import Loader from '../Loader';
export default function EmailSetting({ userRole }) {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [loadingData, setLoadingData] = useState(common.getDefault(common.dataType.bool));
    const breadcrumbOption = [
        { name: 'Home', link: "/Dashboard" },
        { name: 'Email Template', link: "/admin/emailTemplate" },
        { name: 'Email Setting', isActive: false }];
    const [emailSetting, setEmailSetting] = useState(common.getDefault(common.dataType.object));
    const inputHandler = (e, dataType) => {
        debugger;
        if (e.target.type === "checkbox") {
            setEmailSetting({ ...emailSetting, [e.target.name]: e.target.checked });
        }
        else {
            var val = dataType !== undefined && dataType.toLowerCase() === "int" ? Number(e.target.value) : e.target.value;
            setEmailSetting({ ...emailSetting, [e.target.name]: val });
        }
    };
    const handleSubmit = () => {
        if (!common.hasValue(emailSetting.smtp)) {
            toast.warn("Please enter email smtp server detail");
        }
        else if (!common.hasValue(emailSetting.port)) {
            toast.warn("Please enter port number");
        }
        else if (!common.hasValue(emailSetting.username)) {
            toast.warn("Please enter email username");
        }
        else if (!common.hasValue(emailSetting.password)) {
            toast.warn("Please enter email password");
        }
        else {
            setLoadingData(true);
            Api.Post(apiUrlData.emailSetting.updateEmailSetting, emailSetting).then(res => {
                if (res.data > 0) {
                    toast.success(`Email Setting ` + 'Updated');
                }
                else {
                    toast.error(`Email Setting not ` + 'Updated');
                }
                setLoadingData(false);
            }).catch(err => {
                toast.error(common.toastMsg.error);
                setLoadingData(false);
            })
        }
    }
    const buttonOption = {
        buttonText: "Email Setting",
        handler: handleSubmit
    };
    useEffect(() => {
        setLoadingData(true);
        Api.Get(apiUrlData.emailSetting.getEmailSetting).then(res => {
            setEmailSetting(res.data);
            setLoadingData(false);
        }).catch(err => {
            toast.error(common.toastMsg.error);
            setLoadingData(false);
        });
    }, []);
    if (loadingData)
        return <Loader></Loader>
    if (!userRole.isAdmin) {
        return <Unauthorized></Unauthorized>
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="card text-black">
                <div className="card-header bg-primary bg-gradient">
                    <h6 className="card-title">Update Email Setting</h6>
                </div>
                <div className="card-body">
                    <form>
                        <div className="container">
                            <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                                <div className="col">
                                    <div className="mb-3">
                                        <label htmlFor="txtSMTPServer" className="form-label">SMTP Server<strong className="text-danger">*</strong></label>
                                        <input type="text" name="smtp" value={emailSetting.smtp} onChange={e => inputHandler(e)} className="form-control" id="txtSMTPServer" aria-describedby="txtSMTPServerHelp" />
                                        <div id="txtSMTPServerHelp" className="form-text">Enter the SMTP Server name</div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                        <label htmlFor="txtPort" className="form-label">Port Number<strong className="text-danger">*</strong></label>
                                        <input type="number" name="port" value={emailSetting.port} onChange={e => inputHandler(e)} className="form-control" id="txtPort" aria-describedby="txtPortHelp" />
                                        <div id="txtPortHelp" className="form-text">Enter the SMTP Server port number</div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                        <label htmlFor="txtUsername" className="form-label">Username<strong className="text-danger">*</strong></label>
                                        <input type="text" name="username" value={emailSetting.username} onChange={e => inputHandler(e)} className="form-control" id="txtUsername" aria-describedby="txtUsernameHelp" />
                                        <div id="txtUsernameHelp" className="form-text">Enter the email Username</div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                        <label htmlFor="txtPassword" className="form-label">Password<strong className="text-danger">*</strong></label>
                                        <input type="password" name="password" value={emailSetting.password} onChange={e => inputHandler(e)} className="form-control" id="txtPassword" aria-describedby="txtPasswordHelp" />
                                        <div id="txtPasswordHelp" className="form-text">Enter the email Password</div>
                                    </div>
                                </div>
                            </div>
                            <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                                <div className="col">
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input className="form-check-input" onClick={e => inputHandler(e)} aria-describedby="chkIsSSLHelp" type="checkbox" name='isSSL' id='chkIsSSL' value={emailSetting.isSSL} checked={emailSetting.isSSL} />
                                            <label className="form-check-label" htmlFor="chkIsSSL">
                                                Is SSL
                                            </label>
                                        </div><div id="chkIsSSLHelp" className="form-text">Is Email SSL encrypted</div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-12 col-md-12 col-sm-12 col-xs-12">
                                    <AddUpdateButton isUpdateAction={true} option={buttonOption} userRole={userRole}></AddUpdateButton>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
