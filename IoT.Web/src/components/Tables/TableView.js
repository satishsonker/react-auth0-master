import React from 'react'
import { common } from '../../Configurations/common'

import UpdateDeleteButton from '../Buttons/UpdateDeleteButton';
export default function TableView({ options,userRole }) {
    options.headers = common.defaultIfEmpty(options.headers, []);
    options.columns = common.defaultIfEmpty(options.columns, []);
    options.rowData = common.defaultIfEmpty(options.rowData, []);
    options.idName = common.defaultIfEmpty(options.idName, '');
    options.editUrl = common.defaultIfEmpty(options.editUrl, '');
    options.rowNumber = common.defaultIfEmpty(options.rowNumber, true);
    options.action = common.defaultIfEmpty(options.action, true);
    options.userRole = common.defaultIfEmpty(options.userRole, {});
    options.NoRecordMsg = common.defaultIfEmpty(options.NoRecordMsg, 'No Data Found');
    options.deleteHandler = common.defaultIfEmpty(options.deleteHandler, () => { });
    return (
        <div>
            <div className="table-responsive px-3">
                <table className="table">
                    <thead>
                        <tr>
                            {options.rowNumber && <th scope="col">#</th>}
                            {
                                options.headers.map((ele) => {
                                    return <th key={ele} scope="col">{ele}</th>
                                })
                            }
                            {options.action && <th scope="col">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {options.rowData && options.rowData.length === 0 && (
                            <tr>
                                <td className="text-center" colSpan="4">{options.NoRecordMsg}</td>
                            </tr>
                        )
                        }
                        {
                            options.rowData && (options.rowData.map((ele, ind) => {
                                return (
                                    <tr key={ind}>
                                        {options.rowNumber && <td >{ind + 1}</td>}
                                        {
                                            options.columns.map((eleCol) => {
                                                return <td key={ele[eleCol]+Math.random()*1000} >{ele[eleCol]}</td>
                                            })
                                        }
                                        <td>
                                            {options.action && (
                                                <UpdateDeleteButton userRole={userRole} deleteHandler={options.deleteHandler} dataKey={ele[options.idName]} editUrl={options.editUrl}></UpdateDeleteButton>)}

                                        </td>
                                    </tr>
                                )
                            }))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
