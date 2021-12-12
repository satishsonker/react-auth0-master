import React, { useState } from 'react'
import { Link } from "react-router-dom";
import ConfirmationBox from '../Controls/ConfirmationBox';
export default function UpdateDeleteButton({ editUrl, deleteHandler, dataKey, userRole }) {
    let conBoxOption = {
        modelBoxId: "exampleModal" + dataKey,
        deleteHandler: deleteHandler,
        data: dataKey
    }
    // const openModel = (e) => {
    //     deleteHandler(e);
    // }
    return (
        <>
        <ConfirmationBox options={conBoxOption}></ConfirmationBox>
            {/* <div className="modal" id={"exampleModal" + dataKey} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Confirm</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>You want to delete. Are you sure! </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" value={dataKey} className="btn btn-danger" onClick={e => openModel(e)} data-bs-dismiss="modal">Delete</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
             */}
            <div className="btn-group" role="group" aria-label="Basic example">
                {userRole?.canUpdate && <Link to={editUrl + dataKey}><div className="btn btn-sm btn-outline-success"><i className="fas fa-pencil-alt" aria-hidden="true"></i></div></Link>}
                {userRole?.canDelete && <button type="button" data-bs-toggle="modal" data-bs-target={"#exampleModal" + dataKey} className="btn btn-sm btn-outline-danger"><i data-deletekey={dataKey} className="fa fa-trash"></i></button>}
            </div>
        </>
    )
}
