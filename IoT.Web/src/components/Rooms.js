import React, { useState, useEffect } from 'react'
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from './Loader';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { common } from "../Configurations/common";
import Unauthorized from './CustomView/Unauthorized';
import TableView from './Tables/TableView';
import TableHeader from './Tables/TableHeader';
import TableFooter from './Tables/TableFooter';
export default function Rooms({ userRole }) {
    const breadcrumbOption = [{ name: 'Home', link: "/Dashboard", isActive: true }, { name: 'Rooms', link: "", isActive: false }]
    const [roomData, setRoomData] = useState(common.getDefault(common.dataType.array));    
    const [pagingData, setPagingData] = useState({ pageNo: 1, pageSize: 10,currPage:1 });
    const [footerOption, setFooterOption] = useState({ totalRecord: 0,currPage:1 });
    const [loadingData, setLoadingData] = useState(true);
    const [searchTerm, setsearchTerm] = useState("All");
    const apiUrlData = require('../Configurations/apiUrl.json');
    const handleDelete = (val) => {
        setLoadingData(true);
        Api.Delete(apiUrlData.roomController.deleteRoom + '?roomkey=' + val).then(res => {
            setLoadingData(false);
            setsearchTerm("All");
            handleSearch();
            toast.success("Room Deleted.")
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }    
    let tableOption = {
        headers: ['Room', 'Description'],
        columns: ['roomName', 'roomDesc'],
        rowData: roomData,
        idName: 'roomKey',
        editUrl: "/RoomCreate?roomkey=",
        rowNumber: true,
        action: true,
        userRole: userRole,
        NoRecordMsg: 'No Data Found',
        deleteHandler: handleDelete
    }
    const handleSearch = (val) => {
        val = val === undefined || typeof val==='object'? searchTerm : val;
        if (val !== "All" && (val === "" || val.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.roomController.searchRoom + '?searchterm=' + val).then(res => {
            setRoomData(res.data);
            setLoadingData(false)
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    const tableHeaderOption = {
        searchHandler: handleSearch,
        headerName: 'Rooms',
        addUrl: "/RoomCreate"
    }
    useEffect(() => {
        setLoadingData(true);
        Api.Get(apiUrlData.roomController.getAllRoom+'?pageNo='+pagingData.pageNo+'&PageSize='+pagingData.pageSize).then(res => {
           setRoomData(res.data.data);
            if (footerOption.totalRecord !== res.data.totalRecord) {
                var data={totalRecord: res.data.totalRecord,currPage: pagingData.currPage }
                setFooterOption({ ...data});
            }
            else
            setFooterOption({ ...footerOption, ['currPage']: pagingData.currPage });
            setLoadingData(false)
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }, [pagingData.pageSize,pagingData.pageNo]);
    if (!userRole.canView)
        return <Unauthorized></Unauthorized>
    return (
        <div className="page-container">
            {
                loadingData && <Loader></Loader>
            }
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>           
            <TableHeader option={tableHeaderOption} userRole={userRole}></TableHeader>
            <TableView options={tableOption} setPagingData={setPagingData} currPageNo={pagingData.pageNo} currPageSize={pagingData.pageSize} userRole={userRole}></TableView>
            <TableFooter currPageNo={pagingData.pageNo} currPageSize={pagingData.pageSize} option={footerOption} pagingData={setPagingData}></TableFooter>
        </div>
    )
}
