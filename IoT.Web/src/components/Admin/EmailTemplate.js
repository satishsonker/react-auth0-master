import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { common } from '../../Configurations/common';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import { Api } from "../../Configurations/Api";
import Unauthorized from '../CustomView/Unauthorized';
import Loader from '../Loader';
import TableView from '../Tables/TableView';
import TableHeader from '../Tables/TableHeader';
import TableFooter from '../Tables/TableFooter';

export default function EmailTemplate({ userRole }) {
    const apiUrlData = require('../../Configurations/apiUrl.json');
    const breadcrumbOption = [
        { name: 'Home', link: "/Dashboard" },
        { name: 'Email Template', isActive: false }];
    const handleSerach = (e) => {
        if (e !== "All" && (e === "" || e.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.emailTemplate.searchEmailTemplate.replace('{pageSize}',pagingData.pageSize).replace('{pageNo}',pagingData.pageNo).replace('{searchTerm}',e)).then(res => {
            let tblOption = tableOptionTemplate;
            tblOption.rowData = res.data.data;
            setTableOption(tblOption);
            setLoadingData(false)
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    };
    const tableHeaderOption = {
        searchHandler: handleSerach,
        headerName: 'Email Template',
        addUrl: "/admin/EmailTemplateCreate",
        buttons:[
            {
                text:"Email Setting",
                url:"/admin/EmailSettings",
                type:'link'
            }
        ]
    }
    const [pagingData, setPagingData] = useState({ pageNo: 1, pageSize: 10 });
    const [loadingData, setLoadingData] = useState(false);
    useEffect(() => {
        setLoadingData(true);
        let ApiCalls = [];
        ApiCalls.push(Api.Get(apiUrlData.emailTemplate.getEmailTemplates.replace('{pageNo}',pagingData.pageNo).replace('{pageSize}',pagingData.pageSize)));
        Api.MultiCall(ApiCalls).then(res => {
            let tblOption = tableOptionTemplate;
            tblOption.rowData = res[0].data.data;
            tblOption.deleteHandler = handleDelete;
            tblOption.userRole = userRole;
            tblOption.totalRecord = res[0].data.totalRecord;
            setTableOption(tblOption);
            setLoadingData(false);
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }, [userRole, pagingData]);
    const handleDelete = (val) => {
        setLoadingData(true);
        Api.Delete(apiUrlData.emailTemplate.deleteEmailTemplate + '?templateid=' + val).then(res => {
            setLoadingData(false);
            handleSerach();
            toast.success("Email Template deleted.")
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    const handlePreview=(param,data)=>{

    }
    const tableOptionTemplate = {
        headers: ['Template Name', 'Body', 'Subject','Is HTML','Has Attachment', 'Attchment Path'],
        rowNumber: true,
        action: true,
        columns: ['templateName', 'body', 'subject','isHTML','hasAttachment', 'attchmentPath'],
        rowData: common.defaultIfEmpty(undefined, []),
        userRole: userRole,
        totalRecord: 0,
        idName: 'templateId',
        editUrl: "/admin/emailTemplateCreate?templateId=",
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
            <TableFooter option={{ totalRecord: tableOption.totalRecord }} pagingData={setPagingData}></TableFooter>
        </>
    )
}
