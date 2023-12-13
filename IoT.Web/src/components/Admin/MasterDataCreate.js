import React, { useEffect, useState } from 'react'
import Unauthorized from '../CustomView/Unauthorized';
import { Link, Navigate } from "react-router-dom";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { common } from "../../Configurations/common";
import Breadcrumb from '../Breadcrumb/Breadcrumb';
export default function MasterDataCreate({ userRole }) {
    const [loadingData, setLoadingData] = useState(common.getDefault(common.dataType.bool));
    const [isUpdating, setIsUpdating] = useState(common.getDefault(common.dataType.bool));
    const [isCreated, setIsCreated] = useState(common.getDefault(common.dataType.bool));
    const [capabilityTypes, setCapabilityType] = useState({ CapabilityVersionName: '' });
    const [capabilitySupportedProperties, setCapabilitySupportedProperties] = useState(common.getDefault(common.dataType.object));
    const [capabilityInterfaces, setCapabilityInterfaces] = useState(common.getDefault(common.dataType.object));
    const [displayCategories, setDisplayCategories] = useState(common.getDefault(common.dataType.object));
    const [capabilityVersions, setCapabilityVersions] = useState(common.getDefault(common.dataType.object));
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [queryStringType, setQueryStringType] = useState("catyp");
    const [queryStringId, setQueryStringId] = useState();
    const [breadcrumbOption, setBreadcrumbOption] = useState(common.getDefault(common.dataType.arrayObject));
    
    useEffect(() => {
        let queryData=common.queryParam(window.location.search);
       if (common.hasValue(queryData.id)) {
            setQueryStringId(queryData.id)
            setIsUpdating(true);
        }
        if (common.hasValue(queryData.type))
        {
            setQueryStringType(common.hasValue(queryData.type));
            setBreadcrumbOption( [{ name: 'Home', link: "/Dashboard", isActive: true }, { name: 'Master Date', link: "/admin/masterdata?type=" + queryData.type, isActive: true },{ name: (common.hasValue(queryData.id) ? 'Update ' : 'Create ') + 'Master Date', link: "", isActive: false }]);
        }
        if (common.hasValue(queryData.id) && common.hasValue(queryData.type)) {
            switch (queryData.type) {
                case 'catyp':
                    setLoadingData(true);
                    Api.Get(apiUrlData.masterDataController.getCapabilityType + "?id=" + queryData.id)
                        .then(res => {
                            if (res.data.length > 0)
                                setCapabilityType(res.data[0]);
                            setLoadingData(false);
                        }).catch(err=>{
                            setLoadingData(false);
                            toast.error(common.toastMsg.error);
                          });
                    break;
                case 'cvers':
                    setLoadingData(true);
                    Api.Get(apiUrlData.masterDataController.getCapabilityVersion + "?id=" + queryData.id)
                        .then(res => {
                            if (res.data.length > 0)
                                setCapabilityVersions(res.data[0]);
                            setLoadingData(false);
                        }).catch(err=>{
                            setLoadingData(false);
                            toast.error(common.toastMsg.error);
                          });
                    break;
                case 'cdcat':
                    setLoadingData(true);
                    Api.Get(apiUrlData.masterDataController.getDisplayCategory + "?id=" + queryData.id)
                        .then(res => {
                            if (res.data.length > 0)
                                setDisplayCategories(res.data[0]);
                            setLoadingData(false);
                        }).catch(err=>{
                            setLoadingData(false);
                            toast.error(common.toastMsg.error);
                          });
                    break;
                case 'cifa':
                    setLoadingData(true);
                    Api.Get(apiUrlData.masterDataController.getCapabilityInterface + "?id=" + queryData.id)
                        .then(res => {
                            if (res.data.length > 0)
                                setCapabilityInterfaces(res.data[0]);
                            setLoadingData(false);
                        }).catch(err=>{
                            setLoadingData(false);
                            toast.error(common.toastMsg.error);
                          });
                    break;
                case 'cspro':
                    setLoadingData(true);
                    Api.Get(apiUrlData.masterDataController.getCapabilitySupportedProperty + "?id=" + queryData.id)
                        .then(res => {
                            if (res.data.length > 0)
                                setCapabilitySupportedProperties(res.data[0]);
                            setLoadingData(false);
                        }).catch(err=>{
                            setLoadingData(false);
                            toast.error(common.toastMsg.error);
                          });
                    break;

                default:
                    setLoadingData(false);
                    break;
            }
        }

    }, []);

    const inputHandler = (e, type) => {
        switch (type) {
            case 'catyp':
                setCapabilityType({ ...capabilityTypes, [e.target.name]: e.target.value });
                break;
            case 'cvers':
                setCapabilityVersions({ ...capabilityVersions, [e.target.name]: e.target.value });
                break;
            case 'cdcat':
                setDisplayCategories({ ...displayCategories, [e.target.name]: e.target.value });
                break;
            case 'cifa':
                setCapabilityInterfaces({ ...capabilityInterfaces, [e.target.name]: e.target.value });
                break;
            case 'cspro':
                setCapabilitySupportedProperties({ ...capabilitySupportedProperties, [e.target.name]: e.target.value });
                break;

            default:
                break;
        }
    }
    const handleSubmit = () => {
        let url, successMsg, errorMsg = 'Something went wrong. Please try again', postData;
        switch (queryStringType) {
            case 'catyp':
                if (!common.hasValue(capabilityTypes.capabilityTypeName)) {
                    toast.warn('Please enter Capability Type');
                    return;
                }
                else {
                    url = !isUpdating ? apiUrlData.masterDataController.addCapabilityType : apiUrlData.masterDataController.updateCapabilityType;
                    postData = capabilityTypes;
                    successMsg = 'Capability type has been ' + (!isUpdating ? 'added' : 'updated');
                }
                break;
            case 'cvers':
                if (!common.hasValue(capabilityVersions.capabilityVersionName)) {
                    toast.warn('Please enter Capability version');
                    return;
                }
                else {
                    url = !isUpdating ? apiUrlData.masterDataController.addCapabilityVersion : apiUrlData.masterDataController.updateCapabilityVersion;
                    postData = capabilityVersions;
                    successMsg = 'Capability version has been ' + (!isUpdating ? 'added' : 'updated');
                }
                break;
            case 'cdcat':
                if (!common.hasValue(displayCategories.displayCategoryLabel)) {
                    toast.warn('Please enter display category');
                    return;
                }
                else {
                    url = !isUpdating ? apiUrlData.masterDataController.addDisplayCategory : apiUrlData.masterDataController.updateDisplayCategory;
                    postData = common.cloneObject(displayCategories);
                    postData["displayCategoryValue"] = postData["displayCategoryLabel"];
                    successMsg = 'Display category has been ' + (!isUpdating ? 'added' : 'updated');
                }
                break;
            case 'cifa':
                if (!common.hasValue(capabilityInterfaces.capabilityInterfaceName)) {
                    toast.warn('Please enter capability interfaces');
                    return;
                }
                else {
                    url = !isUpdating ? apiUrlData.masterDataController.addCapabilityInterface : apiUrlData.masterDataController.updateCapabilityInterface;
                    postData = capabilityInterfaces;
                    successMsg = 'Capability interfaces has been ' + (!isUpdating ? 'added' : 'updated');
                }
                break;
            case 'cspro':
                if (!common.hasValue(capabilitySupportedProperties.capabilitySupportedPropertyName)) {
                    toast.warn('Please enter capability supported property');
                    return;
                }
                else {
                    url = !isUpdating ? apiUrlData.masterDataController.addCapabilitySupportedProperty : apiUrlData.masterDataController.updateCapabilitySupportedProperty;
                    postData = capabilitySupportedProperties;
                    successMsg = 'Capability supported property has been ' + (!isUpdating ? 'added' : 'updated');
                }
                break;

            default:
                break;
        }
        setLoadingData(true);
        Api.Post(url, postData).then(res => {
            toast.success(successMsg);
            setIsCreated(true);
            setLoadingData(false);
            return<Navigate to={"/admin/MasterData?type=" + queryStringType}></Navigate>
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }
    if(isCreated)
    return <Navigate to={"/admin/MasterData?type=" + queryStringType}></Navigate>
    if (loadingData)
        return <Loader></Loader>
    if (!userRole.isAdmin)
        return <Unauthorized></Unauthorized>
    return (
        <div className="page-container">
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            {isUpdating && queryStringType === 'catyp' ? 'Update' : 'Create'}  Capability Type
                        </button>
                    </h2>
                    <div id="collapseOne" className={queryStringType === "catyp" ? "accordion-collapse collapse show" : "accordion-collapse collapse"} aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="txtCapabilityTypeName" className="form-label">Capability Type<strong className="text-danger">*</strong></label>
                                    <input type="text" name="capabilityTypeName" value={capabilityTypes?.capabilityTypeName} onChange={e => inputHandler(e, 'catyp')} className="form-control" id="txtCapabilityTypeName" aria-describedby="txtCapabilityTypeNameHelp" />
                                    <div id="txtCapabilityTypeNameHelp" className="form-text">Enter the desire device capability type</div>
                                </div>

                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isUpdating ? 'Add ' : 'Update '} Capability Type</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            {isUpdating && queryStringType === 'cvers' ? 'Update' : 'Create'}   Capability Version
                        </button>
                    </h2>
                    <div id="collapseTwo" className={queryStringType === "cvers" ? "accordion-collapse collapse show" : "accordion-collapse collapse"} aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="txtCapabilityVersionName" className="form-label">Capability Version<strong className="text-danger">*</strong></label>
                                    <input type="text" name="capabilityVersionName" value={capabilityVersions?.capabilityVersionName} onChange={e => inputHandler(e, "cvers")} className="form-control" id="txtCapabilityVersionName" aria-describedby="txtCapabilityVersionNameHelp" />
                                    <div id="txtCapabilityVersionNameHelp" className="form-text">Enter the desire device capability version</div>
                                </div>

                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isUpdating ? 'Add ' : 'Update '} Capability Type</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            {isUpdating && queryStringType === 'cdcat' ? 'Update' : 'Create'} Display Category
                        </button>
                    </h2>
                    <div id="collapseThree" className={queryStringType === "cdcat" ? "accordion-collapse collapse show" : "accordion-collapse collapse"} aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="txtDisplayCategoryName" className="form-label">Display Category Name<strong className="text-danger">*</strong></label>
                                    <input type="text" name="displayCategoryLabel" value={displayCategories?.displayCategoryLabel} onChange={e => inputHandler(e, "cdcat")} className="form-control" id="txtDisplayCategoryName" aria-describedby="txtDisplayCategoryNameHelp" />
                                    <div id="txtDisplayCategoryNameHelp" className="form-text">Enter the desire display category name</div>
                                </div>

                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isUpdating ? 'Add ' : 'Update '} Display Category</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour " aria-expanded="false" aria-controls="collapseFour">
                            {isUpdating && queryStringType === 'cifa' ? 'Update' : 'Create'} Capability Interface
                        </button>
                    </h2>
                    <div id="collapseFour" className={queryStringType === "cifa" ? "accordion-collapse collapse show" : "accordion-collapse collapse"} aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="txtCapabilityInterfaceName" className="form-label">Capability Interface Name<strong className="text-danger">*</strong></label>
                                    <input type="text" name="capabilityInterfaceName" value={capabilityInterfaces?.capabilityInterfaceName} onChange={e => inputHandler(e, "cifa")} className="form-control" id="txtCapabilityInterfaceName" aria-describedby="txtCapabilityInterfaceNameHelp" />
                                    <div id="txtCapabilityInterfaceNameHelp" className="form-text">Enter the desire capability interface name</div>
                                </div>

                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isUpdating ? 'Add ' : 'Update '} Capability Interface</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFive">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                            {isUpdating && queryStringType === 'cspro' ? 'Update' : 'Create'} Capability Supported Property
                        </button>
                    </h2>
                    <div id="collapseFive" className={queryStringType === "cspro" ? "accordion-collapse collapse show" : "accordion-collapse collapse"} aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="txtCapabilitySupportedPropertyName" className="form-label">Capability Supported Property Name<strong className="text-danger">*</strong></label>
                                    <input type="text" name="capabilitySupportedPropertyName" value={capabilitySupportedProperties?.capabilitySupportedPropertyName} onChange={e => inputHandler(e, "cspro")} className="form-control" id="txtCapabilitySupportedPropertyName" aria-describedby="txtCapabilitySupportedPropertyNameHelp" />
                                    <div id="txtCapabilitySupportedPropertyNameHelp" className="form-text">Enter the desire capability supported property namee</div>
                                </div>
                                <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">{!isUpdating ? 'Add ' : 'Update '} Capability Supported Property</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
