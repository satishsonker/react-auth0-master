import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { common } from '../../Configurations/common';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import AddUpdateButton from '../Buttons/AddUpdateButton';
import { Api } from "../../Configurations/Api";
import Unauthorized from '../CustomView/Unauthorized';
import Loader from '../Loader';
import { Redirect } from "react-router-dom";

export default function EmailTemplateCreate({ userRole }) {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [loadingData, setLoadingData] = useState(common.getDefault(common.dataType.bool));
    const [isCreated, setIsCreated] = useState(common.getDefault(common.dataType.bool));
    const breadcrumbOption = [
        { name: 'Home', link: "/Dashboard" },
        { name: 'Email Template', link: "/admin/emailTemplate" },
        { name: 'Email Template Create', isActive: false }];
        const [emailKeyword, setEmailKeyword] = useState(common.getDefault(common.dataType.arrayObject));
    const [isTemplateUpdate, setIsTemplateUpdate] = useState(common.getDefault(common.dataType.bool))

    const [emailTemplate, setEmailTemplate] = useState(common.getDefault(common.dataType.object));
    useEffect(() => {
        Api.Get(apiUrlData.dropdownMasterController.getDropdownMaster+'/EmailTemplateKeyword').then(res => {
            debugger;
            setEmailKeyword(res.data);
            setLoadingData(false);
          }).catch(err => {
            toast.error(common.toastMsg.error);
            setLoadingData(false);
          });
        let templateId = common.queryParam(window.location.search)?.templateId;
        if (common.hasValue(templateId)) {
            setIsTemplateUpdate(true);
            Api.Get(apiUrlData.emailTemplate.getEmailTemplate + `/${templateId}`).then(res => {
                setEmailTemplate(res.data);
                setLoadingData(false);
            }).catch(err => {
                toast.error(common.toastMsg.error);
                setLoadingData(false);
            });
        }
        else {
            setIsTemplateUpdate(false);
        }
    }, [])
    const inputHandler = (e, dataType) => {
        if (e.target.type === "checkbox") {
            setEmailTemplate({ ...emailTemplate, [e.target.name]: e.target.checked });
        }
        else {
            var val = dataType !== undefined && dataType.toLowerCase() === "int" ? Number(e.target.value) : e.target.value;
            setEmailTemplate({ ...emailTemplate, [e.target.name]: val });
        }
    };
    const getInputSelection = (elem) => {
        if (typeof elem != "undefined") {
            var wholeText = elem.value;
            var s = elem.selectionStart;
            var e = elem.selectionEnd;
            var selectedText = wholeText.substring(s, e);
            var part1 = wholeText.substring(0, s) + '{{' + selectedText + '}}';
            var part2 = wholeText.substring(s + selectedText.length, wholeText.length);
            return part1 + part2;
        } else {
            return '';
        }
    }
    const handleSelection = (e) => {
        e.preventDefault();
        var txtArea = document.getElementById('txtBody');
        var selectedText = getInputSelection(txtArea);
        if (selectedText != "" && selectedText.length > 0)
            txtArea.value = selectedText;
        else {
            toast.warn("Please select text in email body");
        }
    }
    const handleHtmlPreview = () => {
        var txtArea = document.getElementById('txtBody');
        var previewContainer = document.getElementById('htmlPreview');
        if (emailTemplate.isHTML) {
            previewContainer.innerHTML = txtArea.value;
        }

    }
    const handleSubmit = () => {
        if (!common.hasValue(emailTemplate.templateName)) {
            toast.warn("Please enter email template name");
        }
        else if (!common.hasValue(emailTemplate.subject)) {
            toast.warn("Please enter email subject");
        }
        else if (!common.hasValue(emailTemplate.body)) {
            toast.warn("Please enter email body");
        }
        else {
            var url = !isTemplateUpdate ? apiUrlData.emailTemplate.addEmailTemplate : apiUrlData.emailTemplate.updateEmailTemplate;
            Api.Post(url, emailTemplate).then(res => {
                if (res.data > 0) {
                    toast.success(`Email Template ` + isTemplateUpdate ? 'Updated' : 'Added');
                    setIsCreated(true);
                }
                else {
                    toast.error(`Email Template not ` + isTemplateUpdate ? 'Updated' : 'Added');
                }
            }).catch(err => {
                toast.error(common.toastMsg.error);
            })
        }
    }

    const buttonOption = {
        buttonText: "Template",
        handler: handleSubmit,
        backButtonLink:'/admin/emailTemplate',
    resetModel:emailTemplate,
    modelSetter:setEmailTemplate
    };
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
                    <h6 className="card-title">{!isTemplateUpdate ? 'Add ' : 'Update '}  Email Template</h6>
                </div>
                <div className="card-body">
                    <form>
                        <div className="container">
                            <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                                <div className="col">
                                    <div className="mb-3">
                                        <label htmlFor="txtTemplateName" className="form-label">Template Name<strong className="text-danger">*</strong></label>
                                        <input type="text" name="templateName" value={emailTemplate.templateName} onChange={e => inputHandler(e)} className="form-control" id="txtTemplateName" aria-describedby="txtTemplateNameHelp" />
                                        <div id="txtTemplateNameHelp" className="form-text">Enter template name</div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                        <label htmlFor="txtSubject" className="form-label">Email Subject<strong className="text-danger">*</strong></label>
                                        <input type="text" name="subject" value={emailTemplate.subject} onChange={e => inputHandler(e)} className="form-control" id="txtSubject" aria-describedby="txtSubjectHelp" />
                                        <div id="txtSubjectHelp" className="form-text">Enter email subject</div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label htmlFor="txtKeyword" className="form-label">Email Keyword<strong className="text-danger">*</strong></label>
                                        <select name="keywords" value={emailTemplate.keywords} onChange={e => inputHandler(e)} className="form-control" id="txtSubject" aria-describedby="txtSubjectHelp">
                                            <option value="">Select Keyword</option>
                                            {
                                                emailKeyword?.map(x=>{
                                                   return <option value={x.dataValue}>{x.dataText}</option>
                                                })
                                            }
                                        </select>
                                        <div id="txtSubjectHelp" className="form-text">Select email keyword</div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-12">
                                    <div className="mb-3">
                                        <div className="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                                            <div className="input-group">
                                                <label htmlFor="txtBody" className="form-label">Email Body<strong className="text-danger">*</strong></label>
                                            </div>
                                            <div className="btn-group mb-1" role="group" aria-label="First group">
                                                <button type="button" title='Reset Body' onClick={e => handleSelection(e)} className="btn btn-sm btn-outline-secondary"><i className="fas fa-undo"></i></button>
                                                <button type="button" title='Make word to template which will we replace by data' onClick={e => handleSelection(e)} className="btn btn-sm btn-outline-secondary">{"{...}"}</button>
                                                {emailTemplate.isHTML && (<button type="button" title='View Body as HTML' onClick={e => handleHtmlPreview(e)} className="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>)}
                                            </div>
                                        </div>
                                        <textarea name="body" rows="10" value={emailTemplate.body} onChange={e => inputHandler(e)} className="form-control" id="txtBody" aria-describedby="txtBodyHelp" />
                                        <div id="txtBodyHelp" className="form-text">Enter email body</div>
                                    </div>
                                </div>
                            </div>
                            <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                                <div className="col">
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input className="form-check-input" onClick={e => inputHandler(e)} aria-describedby="chkHasTemplateHelp" type="checkbox" name='hasAttachment' id='chkHasTemplate' value={emailTemplate.hasAttachment} />
                                            <label className="form-check-label" htmlFor="chkHasTemplate">
                                                Has Attachment
                                            </label>
                                        </div><div id="chkHasTemplateHelp" className="form-text">Has Email Attachment</div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input className="form-check-input" onClick={e => inputHandler(e)} aria-describedby="chkIsHTMLHelp" type="checkbox" value={emailTemplate.isHTML} id='chkIsHTML' name='isHTML' checked={emailTemplate.isHTML?'checked':''} />
                                            <label className="form-check-label" htmlFor="chkIsHTML">
                                                Is Email Body HTML
                                            </label>
                                        </div><div id="chkchkIsHTMLHelp" className="form-text">Is Email Body HTML</div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                {emailTemplate.hasAttachment && (
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label htmlFor="txtAttachmentPath" className="form-label">Email Attachment Path</label>
                                            <input type="text" name="attachmentPath" value={emailTemplate.attachmentPath} onChange={e => inputHandler(e)} className="form-control" id="txtAttachmentPath" aria-describedby="txtAttachmentPathHelp" />
                                            <div id="txtAttachmentPathHelp" className="form-text">Enter email attachment path</div>
                                        </div>
                                    </div>
                                )}
                                <div className="col-12 col-md-12 col-sm-12 col-xs-12">
                                    <AddUpdateButton isUpdateAction={isTemplateUpdate} option={buttonOption} userRole={userRole}></AddUpdateButton>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div id='htmlPreview'></div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                isCreated && (<Redirect to="/admin/emailTemplate"/>)
            }
        </>
    )
}
