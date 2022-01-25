import React, { useEffect, useState } from 'react'
import Unauthorized from '../CustomView/Unauthorized';
import { Link } from "react-router-dom";
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { common } from "../../Configurations/common";
import UpdateDeleteButton from '../Buttons/UpdateDeleteButton';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import TableHeader from '../Tables/TableHeader';
import TableView from '../Tables/TableView';
import TableFooter from '../Tables/TableFooter';
export default function DeviceAction({userRole}) { 
    const [recordCount, setRecordCount] = useState(0);
    const [footerOption, setFooterOption] = useState({ totalRecord: 0,currPage:1 });    
    const [pagingData, setPagingData] = useState({pageNo:1,pageSize:10,currPage:1});
    const [loadingData, setLoadingData] = useState(true);
    const [searchTerm, setsearchTerm] = useState("All");
    const apiUrlData = require('../../Configurations/apiUrl.json');
    useEffect(() => {
        setLoadingData(true);
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.adminController.getAllDeviceAction+`?pageNo=${pagingData.pageNo}&pageSize=${pagingData.pageSize}`));
        Api.MultiCall(ApiCalls).then(res => {   
            debugger;        
            setTableOptionTemplate({...tableOptionTemplate,['rowData']:res[0].data.data});
            setRecordCount(res[0].data.totalRecord);
            if (footerOption.totalRecord !== res[0].data.totalRecord) {
                setFooterOption({ ...footerOption, ['totalRecord']: res[0].data.totalRecord });
            }
            setFooterOption({ ...footerOption, ['currPage']: pagingData.currPage });
            setLoadingData(false)
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }, [pagingData.pageSize,pagingData.pageNo]);
    const handleDelete = (e) => {
        var val = e.target.value ? e.target.value : e.target.dataset.deletekey;
        setLoadingData(true);
        Api.Delete(apiUrlData.adminController.deleteDeviceAction + '?deviceactionid=' + val).then(res => {
            setLoadingData(false);
            setsearchTerm("All");
            handleSearch();
            toast.success("Device action deleted.")
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }
    const handleSearch = (e) => {
       setsearchTerm(common.hasValue(e)?e:searchTerm);
        if (searchTerm !== "All" && (searchTerm === "" || searchTerm.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.adminController.searchDeviceAction + '?searchterm=' + searchTerm).then(res => {
            debugger;
            setTableOptionTemplate({...tableOptionTemplate,['rowData']:res.data});
            setLoadingData(false)
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }
    const breadcrumbOption = [
        { name: 'Home', link: "/Dashboard" },
        { name: 'Device Action', isActive: false }
    ];
    const tableHeaderOption = {
        searchHandler: handleSearch,
        headerName: 'Device Actions',
        addUrl: `/admin/DeviceActionCreate`
    }
    const [tableOptionTemplate, setTableOptionTemplate] = useState({
        headers: ['Device Type','Device Action','Device Action Value'],
        rowNumber: true,
        action: true,
        columns: ['deviceType.deviceTypeName','deviceActionName','deviceActionValue'],
        rowData: common.defaultIfEmpty(undefined, []),
        idName: 'deciveActionId',
        editUrl: `/admin/DeviceActionCreate?deviceActionId=`,
        deleteHandler:handleDelete
    });
    if (!userRole?.isAdmin && !loadingData) {
        return (<Unauthorized></Unauthorized>)
    }
    return (
        <div className="page-container">
            {
                loadingData && <Loader></Loader>
            }
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <TableHeader option={tableHeaderOption} userRole={userRole}></TableHeader>
           <TableView currPageNo={pagingData.pageNo}  currPageSize={pagingData.pageSize} options={tableOptionTemplate}  userRole={userRole}></TableView>
           <TableFooter totalRecords={recordCount} currPageNo={pagingData.pageNo} currPageSize={pagingData.pageSize} pagingData={setPagingData} option={footerOption} userRole={userRole}></TableFooter>
           
        </div>
    )
}
