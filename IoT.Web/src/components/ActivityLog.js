import React, { useState, useEffect } from 'react'
import Loader from "../components/Loader";
import { Api } from "../Configurations/Api";
import { common } from "../Configurations/common";
import { toast } from 'react-toastify';
import TableHeader from './Tables/TableHeader';
import Breadcrumb from './Breadcrumb/Breadcrumb';
import TableFooter from './Tables/TableFooter';
import TableView from './Tables/TableView';
export default function ActivityLog({userRole}) {
    const [loadingData, setLoadingData] = useState(false);
    const apiUrlData = require('../Configurations/apiUrl.json');     
    const [recordCount, setRecordCount] = useState(0);
    const [pagingData, setPagingData] = useState({pageNo:1,pageSize:10,currPage:1});   
    const [footerOption, setFooterOption] = useState({ totalRecord: 0,currPage:1 });
    const breadcrumbOption = [
        { name: 'Home', link: "/Dashboard" },
        { name: 'Activity Log', isActive: false }];
    useEffect(() => {
        setLoadingData(true);
        Api.Get(apiUrlData.activityLogController.getAll+`?pageSize=${pagingData.pageSize}&pageNo=${pagingData.pageNo}`).then(res => {
            setTableOptionTemplate({...tableOptionTemplate,['rowData']:res.data.data});
            setRecordCount(res.data.totalRecord);
            if (footerOption.totalRecord !== res.data.totalRecord) {
                setFooterOption({ ...footerOption, ['totalRecord']: res.data.totalRecord });
            }
            setFooterOption({ ...footerOption, ['currPage']: pagingData.currPage });
            setLoadingData(false)
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }, [pagingData.pageSize,pagingData.pageNo]);
    const handleSearch = (searchTerm) => {
        if (searchTerm !== "All" && (searchTerm === "" || searchTerm.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.activityLogController.searchLog +`?pageSize=${pagingData.pageSize}&pageNo=${pagingData.pageNo}&searchterm=${searchTerm}`).then(res => {
            setTableOptionTemplate({...tableOptionTemplate,['rowData']:res.data.data});
            setRecordCount(res.data.totalRecord);
            if (footerOption.totalRecord !== res.data.totalRecord) {
                setFooterOption({ ...footerOption, ['totalRecord']: res.data.totalRecord });
            }
            setFooterOption({ ...footerOption, ['currPage']: pagingData.currPage });
            setLoadingData(false)
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    const tableHeaderOption = {
        headerName: 'Activity Log',
        searchHandler: handleSearch,
    }
    const [tableOptionTemplate, setTableOptionTemplate] = useState({
        headers: ['IPAddress','Location','AppName','Activity','Date'],
        rowNumber: true,
        action: false,
        columns: ['ipAddress','location','appName','activity','createdDate'],
        rowData: common.defaultIfEmpty(undefined, []),
        idName: 'activityLogId',
        editUrl: ``
    });
    return (
        <div className="page-container">
            {
                loadingData && <Loader></Loader>
            }
           <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <TableHeader option={tableHeaderOption} userRole={userRole}></TableHeader>
            <TableView options={tableOptionTemplate} currPageNo={pagingData.pageNo} currPageSize={pagingData.pageSize} userRole={userRole}></TableView>
            <TableFooter option={footerOption} currPageSize={pagingData.pageSize} currPageNo={pagingData.pageNo} pagingData={setPagingData} totalRecords={recordCount}></TableFooter>
          
        </div>
    )
}
