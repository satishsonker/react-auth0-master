import React, { useEffect, useState } from 'react'
import Unauthorized from '../CustomView/Unauthorized';
import { Link } from "react-router-dom";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { common } from "../../Configurations/common";
import UpdateDeleteButton from '../Buttons/UpdateDeleteButton';
import '../../css/MasterData.css'
export default function MasterData({ userRole }) {
    const [loadingData, setLoadingData] = useState(true);
    const [capabilityType, setCapabilityType] = useState([])
    const [capabilitySupportedProperties, setCapabilitySupportedProperties] = useState([])
    const [capabilityInterfaces, setCapabilityInterfaces] = useState([])
    const [displayCategories, setDisplayCategories] = useState([])
    const [capabilityVersions, setCapabilityVersions] = useState([])
    const [searchTerm, setsearchTerm] = useState("All");
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const editUrl = "/admin/MasterDataCreate?type=";
    let tabType = common.queryParam(window.location.search).type;
    tabType = !common.hasValue(tabType) ? 'catyp' : tabType;
    let showAcc = "accordion-collapse collapse show";
    let hideAcc = "accordion-collapse collapse";
    const actionType = {
        capType: "catyp",
        capVersion: "cvers",
        disCat: "cdcat",
        capInt: "cifa",
        capSupp: "cspro"
    }
    useEffect(() => {
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.masterDataController.getCapabilityInterface));
        ApiCalls.push(Api.Get(apiUrlData.masterDataController.getCapabilitySupportedProperty));
        ApiCalls.push(Api.Get(apiUrlData.masterDataController.getCapabilityType));
        ApiCalls.push(Api.Get(apiUrlData.masterDataController.getDisplayCategory));
        ApiCalls.push(Api.Get(apiUrlData.masterDataController.getCapabilityVersion));
        Api.MultiCall(ApiCalls).then(res => {
            if (res.length>0) {
                setCapabilityType(res[2].data);
                setCapabilitySupportedProperties(res[1].data);
                setCapabilityInterfaces(res[0].data);
                setDisplayCategories(res[3].data); 
                setCapabilityVersions(res[4].data);
            }
            setLoadingData(false)
        });
    }, []);
    const handleDeleteCapType = (e) => {
        var val = e.target.value ? e.target.value : e.target.dataset.deletekey;
        setLoadingData(true);
        Api.Delete(apiUrlData.masterDataController.deleteCapabilityType + '?capabilityTypeId=' + val).then(res => {
            setLoadingData(false);
            handleSearch("All",actionType.capType);
            toast.success("Capability type deleted.")
        });
    }
    const handleDeleteCapInt = (e) => {
        var val = e.target.value ? e.target.value : e.target.dataset.deletekey;
        setLoadingData(true);
        Api.Delete(apiUrlData.masterDataController.deleteCapabilityInterface + '?capabilityInterfaceId=' + val).then(res => {
            setLoadingData(false);
            handleSearch("All",actionType.capInt);
            toast.success("Capability interface type deleted.")
        });
    }
    const handleDeleteCapVer= (e) => {
        var val = e.target.value ? e.target.value : e.target.dataset.deletekey;
        setLoadingData(true);
        Api.Delete(apiUrlData.masterDataController.deleteCapabilityVersion + '?capabilityVersionId=' + val).then(res => {
            setLoadingData(false);
            handleSearch("All",actionType.capVersion);
            toast.success("Capability version type deleted.")
        });
    }
    const handleDeleteDisCat = (e) => {
        var val = e.target.value ? e.target.value : e.target.dataset.deletekey;
        setLoadingData(true);
        Api.Delete(apiUrlData.masterDataController.deleteDisplayCategory + '?displayCategoryId=' + val).then(res => {
            setLoadingData(false);
            handleSearch("All",actionType.disCat);
            toast.success("Display categoty type deleted.")
        });
    }
    const handleDeleteSupp= (e) => {
        var val = e.target.value ? e.target.value : e.target.dataset.deletekey;
        setLoadingData(true);
        Api.Delete(apiUrlData.masterDataController.deleteCapabilitySupportedProperty + '?capabilitySupportedPropertyId=' + val).then(res => {
            setLoadingData(false);
            handleSearch("All",actionType.capSupp);
            toast.success("Supported property type deleted.")
        });
    }
    const handleSearch = (val, type) => {
       let search=!common.hasValue(val) || val===''?searchTerm:val;
        switch (type) {
            case actionType.capType:
                setLoadingData(true);
                Api.Get(apiUrlData.masterDataController.searchCapabilityType + "?searchTerm=" + search)
                    .then(res => {
                        setLoadingData(false);
                        setCapabilityType(res.data);
                    });
                break;
                case actionType.capVersion:
                setLoadingData(true);
                Api.Get(apiUrlData.masterDataController.searchCapabilityVersion + "?searchTerm=" + search)
                    .then(res => {                        
                        setLoadingData(false);
                        setCapabilityVersions(res.data);
                    });
                break;
                case actionType.disCat:
                setLoadingData(true);
                Api.Get(apiUrlData.masterDataController.searchDisplayCategory + "?searchTerm=" + search)
                    .then(res => {                        
                        setLoadingData(false);
                        setDisplayCategories(res.data);
                    });
                break;
                case actionType.capInt:
                    setLoadingData(true);
                    Api.Get(apiUrlData.masterDataController.searchCapabilityInterface + "?searchTerm=" + search)
                        .then(res => {                        
                            setLoadingData(false);
                            setCapabilityInterfaces(res.data);
                        });
                    break;
                    case actionType.capSupp:
                    setLoadingData(true);
                    Api.Get(apiUrlData.masterDataController.searchCapabilitySupportedProperty + "?searchTerm=" + search)
                        .then(res => {                        
                            setLoadingData(false);
                            setCapabilitySupportedProperties(res.data);
                        });
                    break;

            default:
                break;
        }
    }
    if (loadingData)
        return <Loader></Loader>
    if (!userRole.isAdmin)
        return <Unauthorized></Unauthorized>
    return (
        <div className="page-container">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/Dashboard">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Device Type</li>
                </ol>
            </nav>
            <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button bg-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Capability Type
                        </button>
                    </h2>
                    <div id="collapseOne" className={tabType === 'catyp' ? showAcc : hideAcc} aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <div className="d-flex justify-content-between bd-highlight mb-3">
                                <div className="p-2 bd-highlight">
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        {userRole.canCreate && <Link to="/admin/MasterDataCreate?type=catyp"><div className="btn btn-sm btn-outline-primary"><i className="fa fa-plus"></i> Add</div></Link>}
                                        {userRole.canView && <button type="button" onClick={e => handleSearch('All',actionType.capType)} className="btn btn-sm btn-outline-primary"><i className="fa fa-sync-alt"></i></button>}
                                    </div>
                                </div>
                                <div className="p-2 "><p className="h5">Capability Types</p></div>
                                <div className="p-2 bd-highlight">
                                    <div className="input-group mb-3">
                                        {userRole.canView && (<input type="text" value={searchTerm} onChange={e => setsearchTerm(e.target.value)} className="form-control form-control-sm" placeholder="Search Room" aria-label="Search Capability Type" aria-describedby="button-addon2" />)}
                                        {userRole.canView && (<button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={e => handleSearch(e.target.value,actionType.capType)}><i className="fa fa-search"></i></button>)}
                                    </div>
                                </div>
                            </div>
                            {userRole.canView &&
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Capability Type Name</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {capabilityType && capabilityType.length === 0 && (
                                                <tr>
                                                    <td className="text-center" colSpan="3">No Data Found</td>
                                                </tr>
                                            )
                                            }
                                            {
                                                capabilityType && (capabilityType.map((ele, ind) => {
                                                    return (
                                                        <tr key={ele.capabilityTypeId}>
                                                            <td >{ind + 1}</td>
                                                            <td>{ele.capabilityTypeName}</td>
                                                            <td><UpdateDeleteButton userRole={userRole} deleteHandler={handleDeleteCapType} dataKey={ele.capabilityTypeId} editUrl={editUrl + "catyp&id="}></UpdateDeleteButton>
                                                            </td>
                                                        </tr>
                                                    )
                                                }))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                        <button className="accordion-button bg-primary collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Capability Version
                        </button>
                    </h2>
                    <div id="collapseTwo" className={tabType === 'cvers' ? showAcc : hideAcc} aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <div className="d-flex justify-content-between bd-highlight mb-3">
                                <div className="p-2 bd-highlight">
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        {userRole.canCreate && <Link to="/admin/MasterDataCreate?type=cvers"><div className="btn btn-sm btn-outline-primary"><i className="fa fa-plus"></i> Add</div></Link>}
                                        {userRole.canView && <button type="button" onClick={e => handleSearch("All",actionType.capVersion)} className="btn btn-sm btn-outline-primary"><i className="fa fa-sync-alt"></i></button>}
                                    </div>
                                </div>
                                <div className="p-2 "><p className="h5">Capability Versions</p></div>
                                <div className="p-2 bd-highlight">
                                    <div className="input-group mb-3">
                                        {userRole.canView && (<input type="text" value={searchTerm} onChange={e => setsearchTerm(e.target.value)} className="form-control form-control-sm" placeholder="Search Room" aria-label="Search Devices" aria-describedby="button-addon2" />)}
                                        {userRole.canView && (<button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={e => handleSearch(e.target.value,actionType.capVersion)}><i className="fa fa-search"></i></button>)}
                                    </div>
                                </div>
                            </div>
                            {userRole.canView &&
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Capability Version</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {capabilityVersions && capabilityVersions.length === 0 && (
                                                <tr>
                                                    <td className="text-center" colSpan="3">No Data Found</td>
                                                </tr>
                                            )
                                            }
                                            {
                                                capabilityVersions && (capabilityVersions.map((ele, ind) => {
                                                    return (
                                                        <tr key={ele.capabilityVersionId}>
                                                            <td >{ind + 1}</td>
                                                            <td>{ele.capabilityVersionName}</td>
                                                            <td><UpdateDeleteButton userRole={userRole} deleteHandler={handleDeleteCapVer} dataKey={ele.capabilityVersionId} editUrl={editUrl + "cvers&id="}></UpdateDeleteButton>
                                                            </td>
                                                        </tr>
                                                    )
                                                }))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                        <button className="accordion-button bg-primary collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            Display Category
                        </button>
                    </h2>
                    <div id="collapseThree" className={tabType === 'cdcat' ? showAcc : hideAcc} aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <div className="d-flex justify-content-between bd-highlight mb-3">
                                <div className="p-2 bd-highlight">
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        {userRole.canCreate && <Link to="/admin/MasterDataCreate?type=cdcat"><div className="btn btn-sm btn-outline-primary"><i className="fa fa-plus"></i> Add</div></Link>}
                                        {userRole.canView && <button type="button" onClick={e => handleSearch("All",actionType.disCat)} className="btn btn-sm btn-outline-primary"><i className="fa fa-sync-alt"></i></button>}
                                    </div>
                                </div>
                                <div className="p-2 "><p className="h5">Display Category</p></div>
                                <div className="p-2 bd-highlight">
                                    <div className="input-group mb-3">
                                        {userRole.canView && (<input type="text" value={searchTerm} onChange={e => setsearchTerm(e.target.value)} className="form-control form-control-sm" placeholder="Search Room" aria-label="Search Display Category" aria-describedby="button-addon2" />)}
                                        {userRole.canView && (<button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={e => handleSearch(e.target.value,actionType.disCat)}><i className="fa fa-search"></i></button>)}
                                    </div>
                                </div>
                            </div>
                            {userRole.canView &&
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Display Category Value</th>
                                                <th scope="col">Display Category Label</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayCategories && displayCategories.length === 0 && (
                                                <tr>
                                                    <td className="text-center" colSpan="3">No Data Found</td>
                                                </tr>
                                            )
                                            }
                                            {
                                                displayCategories && (displayCategories.map((ele, ind) => {
                                                    return (
                                                        <tr key={ele.displayCategoryId}>
                                                            <td >{ind + 1}</td>
                                                            <td>{ele.displayCategoryValue}</td>
                                                            <td>{ele.displayCategoryLabel}</td>
                                                            <td><UpdateDeleteButton userRole={userRole} deleteHandler={handleDeleteDisCat} dataKey={ele.displayCategoryId} editUrl={editUrl + "cdcat&id="}></UpdateDeleteButton>
                                                            </td>
                                                        </tr>
                                                    )
                                                }))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                        <button className="accordion-button bg-primary  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour " aria-expanded="false" aria-controls="collapseFour">
                            Capability Interface
                        </button>
                    </h2>
                    <div id="collapseFour" className={tabType === 'cifa' ? showAcc : hideAcc} aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <div className="d-flex justify-content-between bd-highlight mb-3">
                                <div className="p-2 bd-highlight">
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        {userRole.canCreate && <Link to="/admin/masterdatacreate?type=cifa"><div className="btn btn-sm btn-outline-primary"><i className="fa fa-plus"></i> Add</div></Link>}
                                        {userRole.canView && <button type="button" onClick={e => handleSearch("All",actionType.capInt)} className="btn btn-sm btn-outline-primary"><i className="fa fa-sync-alt"></i></button>}
                                    </div>
                                </div>
                                <div className="p-2 "><p className="h5">Capability Interface</p></div>
                                <div className="p-2 bd-highlight">
                                    <div className="input-group mb-3">
                                        {userRole.canView && (<input type="text" value={searchTerm} onChange={e => setsearchTerm(e.target.value)} className="form-control form-control-sm" placeholder="Search Room" aria-label="Search Capability Interface" aria-describedby="button-addon2" />)}
                                        {userRole.canView && (<button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={e => handleSearch(e.target.value,actionType.capInt)}><i className="fa fa-search"></i></button>)}
                                    </div>
                                </div>
                            </div>
                            {userRole.canView &&
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Capability Interface Name</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {capabilityInterfaces && capabilityInterfaces.length === 0 && (
                                                <tr>
                                                    <td className="text-center" colSpan="3">No Data Found</td>
                                                </tr>
                                            )
                                            }
                                            {
                                                capabilityInterfaces && (capabilityInterfaces.map((ele, ind) => {
                                                    return (
                                                        <tr key={ele.capabilityInterfaceId}>
                                                            <td >{ind + 1}</td>
                                                            <td>{ele.capabilityInterfaceName}</td>
                                                            <td><UpdateDeleteButton userRole={userRole} deleteHandler={handleDeleteCapInt} dataKey={ele.capabilityInterfaceId} editUrl={editUrl + "cifa&id="}></UpdateDeleteButton>
                                                            </td>
                                                        </tr>
                                                    )
                                                }))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFive">
                        <button className="accordion-button bg-primary collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                            Capability Supported Property
                        </button>
                    </h2>
                    <div id="collapseFive" className={tabType === 'cspro' ? showAcc : hideAcc} aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <div className="d-flex justify-content-between bd-highlight mb-3">
                                <div className="p-2 bd-highlight">
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        {userRole.canCreate && <Link to="/admin/masterdatacreate?type=cspro"><div className="btn btn-sm btn-outline-primary"><i className="fa fa-plus"></i> Add</div></Link>}
                                        {userRole.canView && <button type="button" onClick={e => handleSearch("All",actionType.capSupp)} className="btn btn-sm btn-outline-primary"><i className="fa fa-sync-alt"></i></button>}
                                    </div>
                                </div>
                                <div className="p-2 "><p className="h5">Capability Supported Properties</p></div>
                                <div className="p-2 bd-highlight">
                                    <div className="input-group mb-3">
                                        {userRole.canView && (<input type="text" value={searchTerm} onChange={e => setsearchTerm(e.target.value)} className="form-control form-control-sm" placeholder="Search Room" aria-label="Search Devices" aria-describedby="button-addon2" />)}
                                        {userRole.canView && (<button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={e => handleSearch(e.target.value,actionType.capSupp)}><i className="fa fa-search"></i></button>)}
                                    </div>
                                </div>
                            </div>
                            {userRole.canView &&
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Capability Supported Property</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {capabilitySupportedProperties && capabilitySupportedProperties.length === 0 && (
                                                <tr>
                                                    <td className="text-center" colSpan="3">No Data Found</td>
                                                </tr>
                                            )
                                            }
                                            {
                                                capabilitySupportedProperties && (capabilitySupportedProperties.map((ele, ind) => {
                                                    return (
                                                        <tr key={ele.capabilitySupportedPropertyId}>
                                                            <td >{ind + 1}</td>
                                                            <td>{ele.capabilitySupportedPropertyName}</td>
                                                            <td><UpdateDeleteButton userRole={userRole} deleteHandler={handleDeleteSupp} dataKey={ele.capabilitySupportedPropertyId} editUrl={editUrl + "cspro&id="}></UpdateDeleteButton>
                                                            </td>
                                                        </tr>
                                                    )
                                                }))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
