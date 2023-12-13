import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { common } from '../../Configurations/common';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import AddUpdateButton from '../Buttons/AddUpdateButton';
import { Api } from "../../Configurations/Api";
import Unauthorized from '../CustomView/Unauthorized';
import Loader from '../Loader';
import { Navigate } from "react-router-dom";

export default function DropdownMasterCreate({ userRole }) {
  const apiUrlData = require('../../Configurations/apiUrl.json');
  const [loadingData, setLoadingData] = useState(common.getDefault(common.dataType.bool));
  const breadcrumbOption = [
    { name: 'Home', link: "/Dashboard" },
    { name: 'Dropdown Master Data', link: "/admin/dropdownmaster" },
    { name: 'Dropdown Master Create', isActive: false }];
  const [isDataUpdate, setIsDataUpdate] = useState(common.getDefault(common.dataType.bool))
  const [isCreated, setIsCreated] = useState(common.getDefault(common.dataType.bool));
  const [isDataTypeAdded, setIsDataTypeAdded] = useState(common.getDefault(common.dataType.bool));
  const [ddlData, setDdlData] = useState(common.getDefault(common.dataType.object));
  const [ddlDataType, setDdlDataType] = useState(common.getDefault(common.dataType.array));
  useEffect(() => {
    setLoadingData(true);
    Api.Get(apiUrlData.dropdownMasterController.getDropdownDataType).then(res => {
      debugger;
      setDdlDataType(res.data);
      setLoadingData(false);
    }).catch(err => {
      toast.error(common.toastMsg.error);
      setLoadingData(false);
    });
    let dropdowndataId = common.queryParam(window.location.search)?.dropdowndataId;
    if (common.hasValue(dropdowndataId)) {
      setIsDataUpdate(true);
      setLoadingData(true);
      Api.Get(apiUrlData.dropdownMasterController.getDropdownMaster + `/${dropdowndataId}`).then(res => {
        setDdlData(res.data);
        setLoadingData(false);
      }).catch(err => {
        toast.error(common.toastMsg.error);
        setLoadingData(false);
      });
    }
    else {
      setIsDataUpdate(false);
    }
  }, [isDataTypeAdded]);

  const inputHandler = (e, dataType) => {
    var val = dataType !== undefined && dataType.toLowerCase() === "int" ? Number(e.target.value) : e.target.value;
    setDdlData({ ...ddlData, [e.target.name]: val });
  };

  const handleSubmit = () => {
    if (!common.hasValue(ddlData.dataType)) {
      toast.warn("Please select data type name");
    }
    else if (!common.hasValue(ddlData.dataText)) {
      toast.warn("Please enter data text");
    }
    else if (!common.hasValue(ddlData.dataValue)) {
      toast.warn("Please enter data value");
    }
    else {
      var url = !isDataUpdate ? apiUrlData.dropdownMasterController.addDropdownMaster : apiUrlData.dropdownMasterController.updateDropdownMaster;
      Api.Post(url, ddlData).then(res => {
        if (res.data > 0) {
          toast.success(`Dropdown data ` + isDataUpdate ? 'Updated' : 'Added');
          setIsCreated(true);
        }
        else {
          toast.error(`Dropdown data not ` + isDataUpdate ? 'Updated' : 'Added');
          setIsCreated(false);
        }
      }).catch(err => {
        toast.error(common.toastMsg.error);
        setIsCreated(false);
      })
    }
  }
  const buttonOption = {
    buttonText: "Dropdown Data",
    handler: handleSubmit,
    backButtonLink:'/admin/dropdownMaster',
    resetModel:ddlData,
    modelSetter:setDdlData
  };
  const handleAddDataType = () => {
    if(!common.hasValue(ddlData.dataType))
    {
      toast.warn('Enter data type name');
      return;
    }
    setLoadingData(true);
    Api.Post(apiUrlData.dropdownMasterController.addDropdownDataType, ddlData).then(res => {
      setLoadingData(false);
      if (res.data > 0) {
        setIsDataTypeAdded(true);
        toast.success('Data type Added');
      }
      else
      {
        toast.success('Data type not Added');
      }
    }).catch(err => {
      setLoadingData(false);
      setIsDataTypeAdded(false);
      toast.error(common.toastMsg.error);
    });
  }
  if (loadingData)
    return <Loader></Loader>
  if (!userRole.isAdmin) {
    return <Unauthorized></Unauthorized>
  }
  return (
    <>
      <Breadcrumb option={breadcrumbOption}></Breadcrumb>
      <div className="card text-black">
        <div className="card-header bg-primary bg-gradient">
          <h6 className="card-title">{!isDataUpdate ? 'Add ' : 'Update '}  Dropdown Master Data</h6>
        </div>
        <div className="card-body">
          <form>
            <div className="container">
              <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="txtTypeName" className="form-label">Data Type Name<strong className="text-danger">*</strong></label>
                    <div class="input-group">
                    <select name="dataType" value={ddlData.dataType} onChange={e => inputHandler(e)} className="form-control" id="txtTypeName" aria-describedby="txtTypeNameHelp">
                      <option value="">Select Data Type</option>
                      {
                        ddlDataType?.map(ele => {
                          return <option value={ele}>{ele}</option>
                        })
                      }
                    </select>
                    <button type='button' className='btn btn-sm btn-primary' data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fas fa-plus"></i></button>
                    </div>
                    <div id="txtTypeNameHelp" className="form-text">Select the Data Type name</div>
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="txtDataValue" className="form-label">Data Type Name<strong className="text-danger">*</strong></label>
                    <input type="text" name="dataText" value={ddlData.dataText} onChange={e => inputHandler(e)} className="form-control" id="txtDataText" aria-describedby="txtDataTextHelp" />
                    <div id="txtDataTextHelp" className="form-text">Enter the Data display value</div>
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="txtDataValue" className="form-label">Data Type Name<strong className="text-danger">*</strong></label>
                    <input type="text" name="dataValue" value={ddlData.dataValue} onChange={e => inputHandler(e)} className="form-control" id="txtDataValue" aria-describedby="txtDataValueHelp" />
                    <div id="txtDataValueHelp" className="form-text">Enter the Data display value</div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className="col-12 col-md-12 col-sm-12 col-xs-12">
                  <AddUpdateButton isUpdateAction={isDataUpdate} option={buttonOption} userRole={userRole}></AddUpdateButton>
                  {
                    isCreated && (<Navigate to="/admin/dropdownMaster"></Navigate>)
                  }
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Add Dropdown Data Type</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div className="col">
                <div className="mb-3">
                  <label htmlFor="txtDataType" className="form-label">Data Type Name<strong className="text-danger">*</strong></label>
                  <input type="text" name="dataType" value={ddlData.dataType} onChange={e => inputHandler(e)} className="form-control" id="txtDataType" aria-describedby="txtDataTypeHelp" />
                  <div id="txtDataTypeHelp" className="form-text">Enter the Data Type</div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
              <button type="button" data-bs-dismiss="modal" onClick={e => handleAddDataType(e)} class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
