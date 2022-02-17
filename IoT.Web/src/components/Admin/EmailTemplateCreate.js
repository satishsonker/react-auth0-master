import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { common } from '../../Configurations/common';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import AddUpdateButton from '../Buttons/AddUpdateButton';
import { Api } from "../../Configurations/Api";
import Unauthorized from '../CustomView/Unauthorized';
import Loader from '../Loader';

export default function EmailTemplateCreate({ userRole }) {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [loadingData, setLoadingData] = useState(common.getDefault(common.dataType.bool));
    const breadcrumbOption = [
        { name: 'Home', link: "/Dashboard" },
        { name: 'Email Template', link: "/admin/emailTemplate" },
        { name: 'Email Template Create', isActive: false }];
    const [isTemplateUpdate, setIsTemplateUpdate] = useState(common.getDefault(common.dataType.bool))

    const [emailTemplate, setEmailTemplate] = useState(common.getDefault(common.dataType.object));
    useEffect(() => {
        debugger;
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
        debugger;
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
        debugger;
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
        handler: handleSubmit
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
                                        <div id="txtTemplateNameHelp" className="form-text">Enter the template name</div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                        <label htmlFor="txtSubject" className="form-label">Email Subject<strong className="text-danger">*</strong></label>
                                        <input type="text" name="subject" value={emailTemplate.subject} onChange={e => inputHandler(e)} className="form-control" id="txtSubject" aria-describedby="txtSubjectHelp" />
                                        <div id="txtSubjectHelp" className="form-text">Enter the email subject</div>
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
                                                <button type="button" onClick={e => handleSelection(e)} className="btn btn-sm btn-outline-secondary">{"{...}"}</button>
                                                {emailTemplate.isHTML && (<button type="button" onClick={e => handleHtmlPreview(e)} className="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>)}
                                            </div>
                                        </div>
                                        <textarea name="body" rows="10" value={emailTemplate.body} onChange={e => inputHandler(e)} className="form-control" id="txtBody" aria-describedby="txtBodyHelp" />
                                        <div id="txtBodyHelp" className="form-text">Enter the email body</div>
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
                                            <input className="form-check-input" onClick={e => inputHandler(e)} aria-describedby="chkIsHTMLHelp" type="checkbox" value={emailTemplate.isHTML} id='chkIsHTML' name='isHTML' />
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
                                            <div id="txtAttachmentPathHelp" className="form-text">Enter the email attachment path</div>
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
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div id='htmlPreview'></div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
