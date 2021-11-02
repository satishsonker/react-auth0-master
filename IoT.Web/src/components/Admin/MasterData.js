import React, { useEffect, useState } from 'react'
import Unauthorized from '../CustomView/Unauthorized';
import { Link } from "react-router-dom";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { common } from "../../Configurations/common";
import UpdateDeleteButton from '../Buttons/UpdateDeleteButton';
import '../../css/MasterData.css'
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import CapabilityTypesTable from './MasterDataTables/CapabilityTypesTable';
import CapabilityVersionTable from './MasterDataTables/CapabilityVersionTable';
import DisplayCategoryTable from './MasterDataTables/DisplayCategoryTable';
import CapabilityInterfaceTable from './MasterDataTables/CapabilityInterfaceTable';
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
    
    const breadcrumbOption = [{ name: 'Home', link: "/Dashboard", isActive: false }, { name: 'Master Data', link: "", isActive: true }]
    const actionType = {
        capType: "catyp",
        capVersion: "cvers",
        disCat: "cdcat",
        capInt: "cifa",
        capSupp: "cspro"
    }
    useEffect(() => {
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.masterDataController.getCapabilitySupportedProperty));
        Api.MultiCall(ApiCalls).then(res => {
            if (res.length>0) {
                setCapabilitySupportedProperties(res[0].data);
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
       let search=!common.hasValue(val) || val===''?'All':val;
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
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>            
            <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button bg-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Capability Type
                        </button>
                    </h2>
                    <div id="collapseOne" className={tabType === 'catyp' ? showAcc : hideAcc} aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                             <CapabilityTypesTable userRole={userRole}></CapabilityTypesTable>
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
                           <CapabilityVersionTable userRole={userRole}></CapabilityVersionTable>
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
                           <DisplayCategoryTable userRole={userRole}></DisplayCategoryTable>
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
                           <CapabilityInterfaceTable userRole={userRole}></CapabilityInterfaceTable>
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
