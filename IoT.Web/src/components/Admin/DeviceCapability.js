import React, { useEffect, useState } from 'react'
import Unauthorized from '../CustomView/Unauthorized';
import { Api } from "../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { common } from "../../Configurations/common";
import UpdateDeleteButton from '../Buttons/UpdateDeleteButton';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import TableHeader from '../../components/Tables/TableHeader';
import TableView from '../../components/Tables/TableView';
import TableFooter from '../../components/Tables/TableFooter';

export default function DeviceCapability({userRole}) {    
    const [pagingData, setPagingData] = useState({pageNo:1,pageSize:10});
    const [totalRecord, setTotalRecord] = useState(0);
    const breadcrumbOption = [{ name: 'Home', link: "/Dashboard", isActive: true }, { name: 'Device Capabilities', link: "", isActive: false }]
    const [loadingData, setLoadingData] = useState(true);
    const apiUrlData = require('../../Configurations/apiUrl.json');
    useEffect(() => {
        Api.Get(apiUrlData.adminController.getAllDeviceCapability+`?pageNo=${pagingData.pageNo}&pagesize=${pagingData.pageSize}`).then(res => {
         setTableOptionTemplate({...tableOptionTemplate,['rowData']:res.data.data});
            setTotalRecord(res.data.totalRecord);
            setLoadingData(false)
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }, [pagingData.pageNo,pagingData.pageSize]);
    const handleDelete = (val) => {
        setLoadingData(true);
        Api.Delete(apiUrlData.adminController.deleteDeviceType + '?devicetypeid=' + val).then(res => {
            setLoadingData(false);
            handleSearch('All');
            toast.success("Device capability deleted.")
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }
    const handleSearch = (val) => {      
        setLoadingData(true);
        Api.Get(apiUrlData.adminController.searchDeviceCapability + '?searchterm=' + val).then(res => {           
            setTableOptionTemplate({...tableOptionTemplate,['rowData']:res.data.data});
            setTotalRecord(res.data.totalRecord);
            setLoadingData(false)
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }    
    const [tableOptionTemplate, setTableOptionTemplate] = useState({
        headers: ["Device Type","Capability Type","Version","Capability Interface","Display Category","Proactively Reported","Retrievable","Supported Property"],
        rowNumber: true,
        action: true,
        columns: ["deviceType.deviceTypeName","capabilityType","version","capabilityInterface","displayCategory","proactivelyReported","retrievable","supportedProperty"],
        rowData: common.defaultIfEmpty(undefined, []),
        idName: 'deviceCapabilityId',
        editUrl: `/admin/DeviceCapabilityCreate?capabilityid=`,
        deleteHandler:handleDelete
    });
    const tableHeaderOption = {
        searchHandler: handleSearch,
        headerName: 'Device Capabilities',
        addUrl: `/admin/DeviceCapabilityCreate`
    }
    if(loadingData)
    return <Loader></Loader>
    if (!userRole?.isAdmin) {
        return (<Unauthorized></Unauthorized>)
    }
    return (
        <div className="page-container">
              <Breadcrumb option={breadcrumbOption}></Breadcrumb>
              <TableHeader option={tableHeaderOption} userRole={userRole}></TableHeader>
              <TableView  currPageNo={pagingData.pageNo} currPageSize={pagingData.pageSize} options={tableOptionTemplate} userRole={userRole}></TableView>              
            <TableFooter option={{totalRecord:totalRecord}} currPageNo={pagingData.pageNo} currPageSize={pagingData.pageSize} pagingData={setPagingData}></TableFooter>
        
        </div>
    )
}
