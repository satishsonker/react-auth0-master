import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { common } from '../../Configurations/common';
export default function UpdateDeleteButton({ editUrl, deleteHandler, dataKey, userRole }) {
    return (
        <div className="btn-group" role="group" aria-label="Basic example">
            {userRole?.canUpdate && <Link to={editUrl + dataKey}><div className="btn btn-sm btn-outline-success"><i className="fas fa-pencil-alt" aria-hidden="true"></i></div></Link>}
            {userRole?.canDelete && <button type="button" value={dataKey} onClick={e => deleteHandler(e)} className="btn btn-sm btn-outline-danger"><i data-deletekey={dataKey} className="fa fa-trash"></i></button>}
        </div>
    )
}
