import React, { useEffect, useState } from 'react'
import { common } from '../../../Configurations/common';
import TableHeader from '../../Tables/TableHeader';
import TableView from '../../Tables/TableView';
import { Api } from "../../../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from '../../Loader';
import Unauthorized from '../../CustomView/Unauthorized';
import TableFooter from '../../Tables/TableFooter';
export default function DisplayCategoryTable({userRole }) {  
    const [pagingData, setPagingData] = useState({pageNo:1,pageSize:10,currPage:1 });
    const [footerOption, setFooterOption] = useState({ totalRecord: 0,currPage:1, });
    const apiUrlData = require('../../../Configurations/apiUrl.json');
    const actionType="cdcat";    
    const [loadingData, setLoadingData] = useState(common.getDefault(common.dataType.bool));
    const [totalRecord, setTotalRecord] = useState(common.getDefault(common.dataType.int))
    useEffect(() => {
       setLoadingData(true);
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.masterDataController.getDisplayCategory+`?pageNo=${pagingData.pageNo}&pagesize=${pagingData.pageSize}`));
        Api.MultiCall(ApiCalls).then(res => {
            if (res.length>0) {
                setLoadingData(false);
                setTableOptionTemplate({...tableOptionTemplate,['rowData']:res[0].data.data});
                setTotalRecord(res[0].data.totalRecord);
                if (footerOption.totalRecord !== res[0].data.totalRecord) {
                    setFooterOption({ ...footerOption, ['totalRecord']: res[0].data.totalRecord });
                }
                setFooterOption({ ...footerOption, ['currPage']: pagingData.currPage });
            }
        }).catch(err=>{
            setLoadingData(false);
            toast.error(common.toastMsg.error);
          });
    },[pagingData]);
    const handleDeleteCapType = (val) => {
        setLoadingData(true);
        Api.Delete(apiUrlData.masterDataController.deleteDisplayCategory + '?displayCategoryId=' + val).then(res => {
            setLoadingData(false);
            handleSearch("All",actionType.capType);
            toast.success("Capability version deleted.")
        });
    }  
    const handleSearch = (val) => {
        let search=!common.hasValue(val) || val===''?'All':val;
        setLoadingData(true);
        Api.Get(apiUrlData.masterDataController.searchDisplayCategory + "?searchTerm=" + search)
            .then(res => {
                setLoadingData(false);
                setTableOptionTemplate({...tableOptionTemplate,['rowData']:res.data});
            }).catch(err=>{
                setLoadingData(false);
                toast.error(common.toastMsg.error);
              });
     }
    const [tableOptionTemplate, setTableOptionTemplate] = useState({
        headers: ['Display Category Value','Display Category Label'],
        rowNumber: true,
        action: true,
        columns: ['displayCategoryValue','displayCategoryLabel'],
        rowData: common.defaultIfEmpty(undefined, []),
        idName: 'displayCategoryId',
        editUrl: `/admin/MasterDataCreate?type=${actionType}&id=`,
        deleteHandler:handleDeleteCapType
    });
    useEffect(() => {
        setTableOptionTemplate({ ...tableOptionTemplate, ['userRole']: userRole });
    }, [userRole])
    const tableHeaderOption = {
        searchHandler: handleSearch,
        headerName: 'Display Category',
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
                userRole?.canView && <TableView  currPageNo={pagingData.pageNo} currPageSize={pagingData.pageSize} options={tableOptionTemplate} currPageNo={pagingData.pageNo} currPageSize={pagingData.pageSize} userRole={userRole}></TableView>
            }
                <TableFooter totalRecords={totalRecord} currPageNo={pagingData.pageNo} currPageSize={pagingData.pageSize} option={footerOption} pagingData={setPagingData}></TableFooter>
        </div>
    )
}
