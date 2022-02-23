import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { common } from '../../Configurations/common';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import AddUpdateButton from '../Buttons/AddUpdateButton';
import { Api } from "../../Configurations/Api";
import Unauthorized from '../CustomView/Unauthorized';
import Loader from '../Loader';
import TableView from '../Tables/TableView';
import TableHeader from '../Tables/TableHeader';
import TableFooter from '../Tables/TableFooter';


export default function DropdownMaster({ userRole }) {
    const [pagingData, setPagingData] = useState({ pageNo: 1, pageSize: 10 });
    const [loadingData, setLoadingData] = useState(false);
    const [totalRecord, SetTotalRecord] = useState(0);
    const breadcrumbOption = [
        { name: 'Home', link: "/Dashboard" },
        { name: 'Dropdown Master Data', link: "/admin/dropdownmaster", isActive: false }];
        
    const apiUrlData = require('../../Configurations/apiUrl.json');
    useEffect(() => {
        setLoadingData(true);
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.dropdownMasterController.getDropdownMasters.replace('{pageNo}',pagingData.pageNo).replace('{pageSize}',pagingData.pageSize)));
        Api.MultiCall(ApiCalls).then(res => {
            let tblOption = tableOptionTemplate;
            tblOption.rowData = res[0].data.data;
            tblOption.deleteHandler = handleDelete;
            tblOption.userRole = userRole;
            tblOption.totalRecord = res[0].data.totalRecord;
            SetTotalRecord(res[0].data.totalRecord);
            setTableOption(tblOption);
            setLoadingData(false);
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }, [userRole, pagingData]);
    const handleDelete = (val) => {
        setLoadingData(true);
        Api.Delete(apiUrlData.dropdownMasterController.deleteDropdownMaster.replace('{dropdownDataId}',val)).then(res => {
            setLoadingData(false);
            handleSearch('All');
            toast.success("Dropdown data deleted.")
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    const handleSearch = (e) => {
        if (e !== "All" && (e === "" || e.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.dropdownMasterController.searchDropdownMaster.replace('{pageSize}', pagingData.pageSize).replace('{pageNo}', pagingData.pageNo).replace('{searchTerm}', e)).then(res => {
            let tblOption = tableOptionTemplate;
            tblOption.rowData = res.data.data;
            setTableOption(tblOption);
            SetTotalRecord(res.data.totalRecord);
            setLoadingData(false)
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    };
    const tableHeaderOption = {
        searchHandler: handleSearch,
        headerName: 'Dropdown Master',
        addUrl: "/admin/DropdownMasterCreate"
    }
    const tableOptionTemplate = {
        headers: ['Data Type', 'Data Text', 'Data Value'],
        rowNumber: true,
        action: true,
        columns: ['dataType', 'dataText', 'dataValue'],
        rowData: common.defaultIfEmpty(undefined, []),
        userRole: userRole,
        totalRecord: 0,
        idName: 'dropdownDataId',
        editUrl: "/admin/dropdownMasterCreate?dropdowndataId=",
        deleteHandler: handleDelete,
        // customCell:[{
        //     cellNo: 1,
        //     type: common.customCellType.button,
        //     handler: handlePreview,
        //     buttonText: 'View Body',
        //     handlerParam: []
        // }]
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplate);
    if (!userRole?.isAdmin) {
        return (<Unauthorized></Unauthorized>)
    }
    return (
        <> 
        {
            loadingData && <Loader></Loader>
        }
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <TableHeader option={tableHeaderOption} userRole={userRole}></TableHeader>
            <TableView options={tableOption} userRole={userRole}></TableView>
            <TableFooter option={{ totalRecord: totalRecord }} pagingData={setPagingData}></TableFooter>
        </>);
}
