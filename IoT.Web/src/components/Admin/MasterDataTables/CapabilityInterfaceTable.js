import React, { useEffect, useState } from 'react'
import { common } from '../../../Configurations/common';
import TableHeader from '../../Tables/TableHeader';
import TableView from '../../Tables/TableView';
import { Api } from "../../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from '../../Loader';
import Unauthorized from '../../CustomView/Unauthorized';
import TableFooter from '../../Tables/TableFooter';
export default function CapabilityInterfaceTable({ userRole }) {
    const [pagingData, setPagingData] = useState({ pageNo: 1, pageSize: 10,currPage:1 });
    const apiUrlData = require('../../../Configurations/apiUrl.json');
    const actionType = "cifa";
    const [loadingData, setLoadingData] = useState(false);
    const [footerOption, setFooterOption] = useState({ totalRecord: 0,currPage:1 });
    useEffect(() => {
        setLoadingData(true);
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.masterDataController.getCapabilityInterface + `?pageNo=${pagingData.pageNo}&pagesize=${pagingData.pageSize}`));
        Api.MultiCall(ApiCalls).then(res => {
            if (res.length > 0) {
                setLoadingData(false);
                setTableOptionTemplate({ ...tableOptionTemplate, ['rowData']: res[0].data.data });
                if (footerOption.totalRecord !== res[0].data.totalRecords) {
                    setFooterOption({ ...footerOption, ['totalRecord']: res[0].data.totalRecords });
                }
                setFooterOption({ ...footerOption, ['currPage']: pagingData.currPage });

            }
        });
    }, [pagingData]);
    const handleDeleteCapType = (e) => {
        var val = e.target.value ? e.target.value : e.target.dataset.deletekey;
        setLoadingData(true);
        Api.Delete(apiUrlData.masterDataController.deleteCapabilityInterface + '?capabilityInterfaceId=' + val).then(res => {
            setLoadingData(false);
            handleSearch("All", actionType.capType);
            toast.success("Capability version deleted.")
        });
    }
    const handleSearch = (val) => {
        let search = !common.hasValue(val) || val === '' ? 'All' : val;
        setLoadingData(true);
        Api.Get(apiUrlData.masterDataController.searchCapabilityInterface + "?searchTerm=" + search)
            .then(res => {
                setLoadingData(false);
                setTableOptionTemplate({ ...tableOptionTemplate, ['rowData']: res.data });
            });
    }
    const [tableOptionTemplate, setTableOptionTemplate] = useState({
        headers: ['Capability Interface Name'],
        rowNumber: true,
        action: true,
        columns: ['capabilityInterfaceName'],
        rowData: common.defaultIfEmpty(undefined, []),
        idName: 'capabilityInterfaceId',
        editUrl: `/admin/MasterDataCreate?type=${actionType}&id=`,
        deleteHandler: handleDeleteCapType
    });
    useEffect(() => {
        setTableOptionTemplate({ ...tableOptionTemplate, ['userRole']: userRole });
    }, [userRole])
    const tableHeaderOption = {
        searchHandler: handleSearch,
        headerName: 'Capability Interface',
        addUrl: `/admin/MasterDataCreate?type=${actionType}`
    }
    if (loadingData)
        return <Loader></Loader>
    if (!userRole.isAdmin)
        return <Unauthorized></Unauthorized>
    return (
        <div className="mb-5">
            <TableHeader option={tableHeaderOption} userRole={userRole}></TableHeader>
            {
                userRole?.canView && <TableView options={tableOptionTemplate} userRole={userRole}></TableView>
            }
            <TableFooter option={footerOption} pagingData={setPagingData}></TableFooter>
        </div>
    )
}
