import React, { useEffect, useState } from 'react'
import Unauthorized from '../CustomView/Unauthorized';
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { common } from "../../Configurations/common";
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import TableView from '../Tables/TableView';
import TableHeader from '../Tables/TableHeader';
import TableFooter from '../Tables/TableFooter';
export default function DeviceType({ userRole }) {
    
    const breadcrumbOption = [{ name: 'Home', link: "/Dashboard", isActive: true }, { name: 'Device Type', link: "", isActive: false }]

    const handleSerach = (e) => {
        if (e !== "All" && (e === "" || e.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.adminController.searchDeviceType + '?searchterm=' + e).then(res => {
            let tblOption = tableOptionTemplate;
            tblOption.rowData = res.data;
            setTableOption(tblOption);
            setLoadingData(false)
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    };
    const tableHeaderOption = {
        searchHandler: handleSerach,
        headerName: 'Device Type',
        addUrl: "/admin/DeviceTypeCreate"
    }
    const [pagingData, setPagingData] = useState({pageNo:1,pageSize:10});
    const [loadingData, setLoadingData] = useState(false);
    const apiUrlData = require('../../Configurations/apiUrl.json');
    useEffect(() => {
        setLoadingData(true);
        let ApiCalls = [];
        ApiCalls.push(Api.Get(`${apiUrlData.deviceController.getDeviceTypePaging}?pageno=${pagingData.pageNo}&pagesize=${pagingData.pageSize}`));
        Api.MultiCall(ApiCalls).then(res => {
            let tblOption = tableOptionTemplate;
            tblOption.rowData = res[0].data.data;
            tblOption.deleteHandler = handleDelete;
            tblOption.userRole = userRole;
            tblOption.totalRecord=res[0].data.totalRecord;
            setTableOption(tblOption);
            setLoadingData(false);
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }, [userRole,pagingData]);
    const handleDelete = (val) => {
        setLoadingData(true);
        Api.Delete(apiUrlData.adminController.deleteDeviceType + '?devicetypeid=' + val).then(res => {
            setLoadingData(false);
            handleSerach();
            toast.success("Device type deleted.")
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }
    const tableOptionTemplate = {
        headers: ['Device Type','Alexa Compatible','Google Compatible'],
        rowNumber: true,
        action: true,
        columns: ['deviceTypeName','isAlexaCompatible','isGoogleCompatible'],
        rowData: common.defaultIfEmpty(undefined, []),
        userRole: userRole,
        totalRecord:0,
        idName: 'deviceTypeId',
        editUrl: "/admin/DeviceTypeCreate?devicetypeid=",
        deleteHandler:handleDelete
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplate);
    if (!userRole?.isAdmin) {
        return (<Unauthorized></Unauthorized>)
    }
    return (
        <div className="page-container">
            {
                loadingData && <Loader></Loader>
            }

            {userRole.canView &&
                <>
                    <Breadcrumb option={breadcrumbOption}></Breadcrumb>
                    <TableHeader option={tableHeaderOption} userRole={userRole}></TableHeader>
                    <TableView options={tableOption} userRole={userRole}></TableView>
                    <TableFooter option={{totalRecord:tableOption.totalRecord}} pagingData={setPagingData}></TableFooter>
                </>
            }
        </div>
    )
}
