import React, { useEffect, useState } from 'react'
import { common } from '../../../Configurations/common';
import TableHeader from '../../Tables/TableHeader';
import TableView from '../../Tables/TableView';
import { Api } from "../../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from '../../Loader';
import Unauthorized from '../../CustomView/Unauthorized';
import TableFooter from '../../Tables/TableFooter';
export default function CapabilityTypesTable({userRole }) {  
    const [pagingData, setPagingData] = useState({pageNo:1,pageSize:10});
    const apiUrlData = require('../../../Configurations/apiUrl.json');
    const actionType="catyp";    
    const [loadingData, setLoadingData] = useState(false);
    useEffect(() => {
        setLoadingData(true);
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.masterDataController.getCapabilityType+`?pageNo=${pagingData.pageNo}&pagesize=${pagingData.pageSize}`));
        Api.MultiCall(ApiCalls).then(res => {
            if (res.length>0) {
                setLoadingData(false);
                setTableOptionTemplate({...tableOptionTemplate,['rowData']:res[0].data});
            }
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    },[pagingData]);
    const handleDeleteCapType = (val) => {
        setLoadingData(true);
        Api.Delete(apiUrlData.masterDataController.deleteCapabilityType + '?capabilityTypeId=' + val).then(res => {
            setLoadingData(false);
            handleSearch("All",actionType.capType);
            toast.success("Capability type deleted.")
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    }  
    const handleSearch = (val) => {
        let search=!common.hasValue(val) || val===''?'All':val;
        setLoadingData(true);
        Api.Get(apiUrlData.masterDataController.searchCapabilityType + "?searchTerm=" + search)
            .then(res => {
                setLoadingData(false);
                setTableOptionTemplate({...tableOptionTemplate,['rowData']:res.data});
            }).catch(err=>{
                setLoadingData(false);
                toast.error(common.toastMsg.error);
              });
     }
    const [tableOptionTemplate, setTableOptionTemplate] = useState({
        headers: ['Capability Type Name'],
        rowNumber: true,
        action: true,
        columns: ['capabilityTypeName'],
        rowData: common.defaultIfEmpty(undefined, []),
        idName: 'capabilityTypeId',
        editUrl: `/admin/MasterDataCreate?type=${actionType}&id=`,
        deleteHandler:handleDeleteCapType
    });
    useEffect(() => {
        setTableOptionTemplate({ ...tableOptionTemplate, ['userRole']: userRole });
    }, [userRole])
    const tableHeaderOption = {
        searchHandler: handleSearch,
        headerName: 'Capability Types',
        addUrl: `/admin/MasterDataCreate?type=${actionType}`
    }
    if(loadingData)
    return <Loader></Loader>
    if (!userRole.isAdmin)
    return <Unauthorized></Unauthorized>
    return (
        <div className="mb-5">
            <TableHeader option={tableHeaderOption} userRole={userRole}></TableHeader>
            {
                userRole?.canView && <TableView options={tableOptionTemplate}  userRole={userRole}></TableView>
            }
            <TableFooter option={{totalRecord:tableOptionTemplate.rowData.length}} pagingData={setPagingData}></TableFooter>
        </div>
    )
}
