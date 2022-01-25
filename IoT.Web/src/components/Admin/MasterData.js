import React from 'react'
import Unauthorized from '../CustomView/Unauthorized';
import { common } from "../../Configurations/common";
import '../../css/MasterData.css'
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import CapabilityTypesTable from './MasterDataTables/CapabilityTypesTable';
import CapabilityVersionTable from './MasterDataTables/CapabilityVersionTable';
import DisplayCategoryTable from './MasterDataTables/DisplayCategoryTable';
import CapabilityInterfaceTable from './MasterDataTables/CapabilityInterfaceTable';
import CapabilitySupportTable from './MasterDataTables/CapabilitySupportTable';
export default function MasterData({ userRole }) {
    let tabType = common.queryParam(window.location.search).type;
    tabType = !common.hasValue(tabType) ? 'catyp' : tabType;
    let showAcc = "accordion-collapse collapse show";
    let hideAcc = "accordion-collapse collapse";
    
    const breadcrumbOption = [{ name: 'Home', link: "/Dashboard", isActive: true }, { name: 'Master Data', link: "", isActive: false }]
  
    if (!userRole.isAdmin)
        return <Unauthorized></Unauthorized> 
    return (
        <div className="page-container">
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>            
            <div className="accordion m-2" id="accordionExample">
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
                            <CapabilitySupportTable userRole={userRole}></CapabilitySupportTable>
                            {/* <div className="d-flex justify-content-between bd-highlight mb-3">
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
                            } */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
