import React,{useState} from 'react'
import { common } from '../../Configurations/common'

export default function ConfirmationBox({userRole,options}) {
        options.title=common.defaultIfEmpty(options.title,'Delete Confirm');
        options.msg=common.defaultIfEmpty(options.msg,'You want to delete! Are you sure?');
        options.modelBoxId=common.defaultIfEmpty(options.modelBoxId,'confirmModelBox');
        options.deleteHandler=common.defaultIfEmpty(options.deleteHandler,()=>{});
        options.cancelButtonText=common.defaultIfEmpty(options.cancelButtonText,'Cancel');
        options.actionButtonText=common.defaultIfEmpty(options.actionButtonText,'Delete');
        options.data=common.defaultIfEmpty(options.data,'');
    return (
        <>
         <div className="modal" id={options.modelBoxId} tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{options.title}</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <p>{options.msg}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button"  className="btn btn-danger" onClick={e => options.deleteHandler(options.data)} data-bs-dismiss="modal">{options.actionButtonText}</button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">{options.cancelButtonText}</button>
                                </div>
                            </div>
                        </div>
                    </div>
        </>
    )
}
