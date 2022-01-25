import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Api } from "../Configurations/Api";
import { toast } from 'react-toastify';
import Loader from './Loader';
import { common } from '../Configurations/common';
import Unauthorized from './CustomView/Unauthorized';
import Breadcrumb from './Breadcrumb/Breadcrumb';
import TableHeader from './Tables/TableHeader';
import TableView from './Tables/TableView';
import TableFooter from './Tables/TableFooter';

export default function Scenes({ userRole }) {
    const [sceneData, setSceneData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [pagingData, setPagingData] = useState({pageNo:1,pageSize:10,currPage:1});      
    const [recordCount, setRecordCount] = useState(0);
    const [footerOption, setFooterOption] = useState({ totalRecord: 0,currPage:1 });
    const apiUrlData = require('../Configurations/apiUrl.json');
    const breadcrumbOption = [
        { name: 'Home', link: "/Dashboard" },
        { name: 'Scenes', isActive: false }];
    const handleTestScene = (sceneKey) => {
        Api.Get(apiUrlData.sceneController.getScene + "?scenekey=" + sceneKey).then(res => {
            let data = res.data;
            if (data) {
                let pubData = common.getStorePubData();
                pubData = !common.hasValue(pubData) ? [] : pubData;

                data.sceneActions.forEach(element => {
                    var newObj = {
                        deviceId: '',
                        action: '',
                        topic: window.iotGlobal.apiKey,
                        value: ''
                    };
                    newObj.deviceId = element.device.deviceKey;
                    switch (element.action.toLowerCase()) {
                        case 'turnon':
                            newObj.value = 'ON';
                            newObj.action = 'setPowerState';
                            break;
                        case 'turnon':
                            newObj.value = 'OFF';
                            newObj.action = 'setPowerState';
                            break;
                        case 'brigthness':
                            newObj.action = 'setBrightness';
                        case 'color':
                            newObj.action = 'setColor';
                            break;
                        default:
                            break;
                    }
                    pubData.push({ ...newObj });
                });
                common.setStorePubData(pubData);
            }
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    const handleDelete = (val) => {
        setLoadingData(true);
        Api.Delete(apiUrlData.sceneController.deleteScene + '?scenekey=' + val).then(res => {
            setLoadingData(false);
            handleSearch();
            toast.success("Scene Deleted.")
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm !== "All" && (searchTerm === "" || searchTerm.length < 3)) {
            toast.warn("Please enter 3 char to search.");
            return;
        }
        setLoadingData(true);
        Api.Get(apiUrlData.sceneController.searchScene + '?searchterm=' + searchTerm).then(res => {
            setSceneData(res.data);
            setLoadingData(false)
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }
    useEffect(() => {
        Api.Get(apiUrlData.sceneController.getAllScene+`?pageNo=${pagingData.pageNo}&pageSize=${pagingData.pageSize}`).then(res => {
            setLoadingData(false);
                setTableOptionTemplate({...tableOptionTemplate,['rowData']:res.data.data});
                setRecordCount(res.data.totalRecord);
                if (footerOption.totalRecord !== res.data.totalRecord) {
                    setFooterOption({ ...footerOption, ['totalRecord']: res.data.totalRecord });
                }
                setFooterOption({ ...footerOption, ['currPage']: pagingData.currPage });
        }).catch(err => {
            setLoadingData(false);
            toast.error(common.toastMsg.error);
        });
    }, [loadingData, apiUrlData.sceneController.getAllScene]);
    const tableHeaderOption = {
        searchHandler: handleSearch,
        headerName: 'Scenes',
        addUrl: `/SceneCreate`
    }
    const [tableOptionTemplate, setTableOptionTemplate] = useState({
        headers: ['Scene','Description','Test Scene'],
        rowNumber: true,
        action: true,
        columns: ['sceneName','sceneDesc'],
        rowData: common.defaultIfEmpty(undefined, []),
        idName: 'sceneKey',
        editUrl: `/SceneCreate?scenekey=`,
        customCell:[{
            cellNo:2,
            type:common.customCellType.button,
            handler:handleTestScene,
            handlerParam:['sceneKey'],
            buttonText:'Test Scene',
        }],
        deleteHandler:handleDelete
    });
    if (loadingData)
        return <Loader></Loader>
    if (!userRole?.canView)
        return <Unauthorized></Unauthorized>
    return (
        <div className="page-container">
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <TableHeader option={tableHeaderOption} userRole={userRole}></TableHeader>
            <TableView  options={tableOptionTemplate} currPageNo={pagingData.pageNo} currPageSize={pagingData.pageSize} userRole={userRole}></TableView>
      <TableFooter option={footerOption} currPageSize={pagingData.pageSize} currPageNo={pagingData.pageNo} pagingData={setPagingData} totalRecords={recordCount}></TableFooter>
       </div>

    )
}
