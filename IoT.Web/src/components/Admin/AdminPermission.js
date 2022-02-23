import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import { common } from "../../Configurations/common";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from "../Loader";
import Unauthorized from "../CustomView/Unauthorized";
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import TableHeader from '../Tables/TableHeader';
import TableFooter from '../Tables/TableFooter';

export default function AdminPermission({ userRole }) {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const [pagingData, setPagingData] = useState({pageNo:1,pageSize:10});
    const [adminPermissions, setAdminPermissions] = useState(common.getDefault(common.dataType.arrayObject));
    const [loadingData, setLoadingData] = useState(true);
    const [footerOption, setFooterOption] = useState({ totalRecord: 0,currPage:1 });
    useEffect(() => {
        let ApiCalls = common.getDefault(common.dataType.array);
        ApiCalls.push(Api.Get(apiUrlData.userController.getAllUserPermissions+`/${pagingData.pageNo}/${pagingData.pageSize}`));
        Api.MultiCall(ApiCalls).then(res => {
            var newData=[];
            res[0].data.data.forEach(element => {
                debugger
                var tempData={
                    firstName:element.firstName,
                    lastName:element.lastname,
                    email:element.email,
                    userKey:element.userKey,
                    userId:element.userId,
                    ...element.userPermissions[0]
                };
                ['canView','canUpdate','canDelete','canCreate','isAdmin'].forEach(ele=>{
                    if(!tempData.hasOwnProperty(ele))
                    {
                        tempData[ele]=false;
                    }
                });
                 if(!tempData.hasOwnProperty('userPermissionId'))
                    {
                        tempData['userPermissionId']=0;
                    }
                newData.push(tempData);
            });
            setAdminPermissions(newData);
            if (footerOption.totalRecord !== res.data.totalRecord) {
                var data={totalRecord: res.data.totalRecord,currPage: pagingData.currPage }
                setFooterOption({ ...data});
            }
            else
            setFooterOption({ ...footerOption, ['currPage']: pagingData.currPage });
            setLoadingData(false);
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }, [pagingData.pageSize,pagingData.pageNo]);
    const handleChange = (e, index) => {
        let data = common.cloneObject(adminPermissions);
        data[index][e.target.name] = e.target.checked;
        setAdminPermissions(data);
    }
    const handleSubmit = () => {
        setLoadingData(true);
        Api.Post(apiUrlData.adminController.updateAdminPermission, adminPermissions).then(res => {
            setLoadingData(false);
            if (res.data) {
                toast.success('Permissions updated');
            }
            else
                toast.warn('Unable to updated permissions');
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    const handleSearch = (val) => {
       // val = val === undefined || typeof val==='object'? searchTerm : val;
        if (val !== "All" && (val === "" || val.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.userController.searchPermissions + `/${val}/${pagingData.pageNo}/${pagingData.pageSize}`).then(res => {
            setAdminPermissions(res.data.data);
            if (footerOption.totalRecord !== res.data.totalRecord) {
                var data={totalRecord: res.data.totalRecord,currPage: pagingData.currPage }
                setFooterOption({ ...data});
            }
            else
            setFooterOption({ ...footerOption, ['currPage']: pagingData.currPage });
            setLoadingData(false);
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    const breadcrumbOption = [
        { name: 'Home', link: "/Dashboard" },
        { name: 'Admin Permission', isActive: false }];
    const tableHeaderOption = {
        searchHandler: handleSearch,
        headerName: 'Admin Permission',
        showAddButton:false
    }
    if (loadingData)
        return <Loader></Loader>
    if (!userRole?.isAdmin) {
        return <Unauthorized></Unauthorized>
    }
    return (
        <div className="page-container">
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <TableHeader option={tableHeaderOption} userRole={userRole}></TableHeader>
            <div className="row">
                <div className="col mb-3">
                    <div className="card text-black">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">User Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">View Access</th>
                                            <th scope="col">Create Access</th>
                                            <th scope="col">Update Access</th>
                                            <th scope="col">Delete Access</th>
                                            <th scope="col">Is Admin User</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!common.hasValue(adminPermissions) || adminPermissions.length === 0 && (
                                            <tr key="2">
                                                <td className="text-center" colSpan="8">No Data Found</td>
                                            </tr>
                                        )
                                        }
                                        {
                                            adminPermissions.map((ele, ind) => {
                                                return (
                                                    <tr key={ele?.email+ind?.toString()}>
                                                        <td >{ind + 1}</td>
                                                        <td>{common.getDefaultIfEmpty(common.getDefaultIfEmpty(ele?.firstName) + " " + common.getDefaultIfEmpty(ele?.lastName), 'No Name')}</td>
                                                        <td>{common.getDefaultIfEmpty(ele?.email,'')}</td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input onChange={e => handleChange(e, ind)} name="canView" className="form-check-input" type="checkbox" checked={ele?.canView} id="flexSwitchCheckDefault" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input onChange={e => handleChange(e, ind)} name="canCreate" className="form-check-input" type="checkbox" checked={ele?.canCreate} id="flexSwitchCheckDefault" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input onChange={e => handleChange(e, ind)} name="canUpdate" className="form-check-input" type="checkbox" checked={ele?.canUpdate} id="flexSwitchCheckDefault" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input onChange={e => handleChange(e, ind)} name="canDelete" className="form-check-input" type="checkbox" checked={ele?.canDelete} id="flexSwitchCheckDefault" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input onChange={e => handleChange(e, ind)} name="isAdmin" className="form-check-input" type="checkbox" checked={ele?.isAdmin} id="flexSwitchCheckDefault" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                {userRole?.canUpdate && <button type="button" onClick={e => handleSubmit(e)} className="btn btn-primary">Update</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <TableFooter currPageNo={pagingData.pageNo} totalRecords={footerOption.totalRecord} currPageSize={pagingData.pageSize} option={footerOption} pagingData={setPagingData}></TableFooter>
        </div>
    )
}
