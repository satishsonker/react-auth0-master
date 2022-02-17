import React from 'react'
import { common } from '../../Configurations/common'

import UpdateDeleteButton from '../Buttons/UpdateDeleteButton';
export default function TableView({ options, userRole, currPageNo, currPageSize }) {
    options.headers = common.defaultIfEmpty(options.headers, []);
    options.columns = common.defaultIfEmpty(options.columns, []);
    options.rowData = common.defaultIfEmpty(options.rowData, []);
    options.customCell = common.defaultIfEmpty(options.customCell, [{
        cellNo: -1,
        type: common.customCellType.cell,
        handler: (param,data,index) => { },
        buttonText: '',
        handlerParam: []
    }]);
    options.idName = common.defaultIfEmpty(options.idName, '');
    options.editUrl = common.defaultIfEmpty(options.editUrl, '');
    options.rowNumber = common.defaultIfEmpty(options.rowNumber, true);
    options.action = common.defaultIfEmpty(options.action, true);
    options.userRole = common.defaultIfEmpty(options.userRole, {});
    options.NoRecordMsg = common.defaultIfEmpty(options.NoRecordMsg, 'No Data Found');
    options.deleteHandler = common.defaultIfEmpty(options.deleteHandler, () => { });
    currPageNo = common.defaultIfEmpty(currPageNo, 1);
    currPageSize = common.defaultIfEmpty(currPageSize, 10);
    if (options.customCell.length > 0) {
        options.customCell.map((ele,ind) => {
            if (ele.cellNo!==-1 && options.columns[ele.cellNo] !== ele.cellNo) {
                options.columns.splice(ele.cellNo, 0, ele.cellNo);
            }
        });
    }
    return (
        <div style={{ overflowY: 'auto', maxHeight: '58vh' }}>
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
                                <td className="text-center" colSpan={options.headers.length+2}>{options.NoRecordMsg}</td>
                            </tr>
                        )
                        }
                        {
                            options.rowData && (options.rowData.map((ele, ind) => {
                                var customCellIndex = 0;
                                return (
                                    <tr key={ind}>
                                        {options.rowNumber && <td >{((currPageNo - 1) * currPageSize) + 1 + ind}</td>}
                                        {
                                            options.columns.map((eleCol, eleColInd) => {
                                                if (typeof(eleCol)==='number' && options.customCell[customCellIndex].cellNo === eleColInd) {
                                                    if (options.customCell[customCellIndex].type === common.customCellType.button) {
                                                        var index=customCellIndex;
                                                        if(options.customCell.length-1<customCellIndex)
                                                        customCellIndex++;
                                                        return <td key={ele[eleCol] + Math.random() * 1000} ><button className="btn btn-primary" onClick={e => options.customCell[index].handler(ele[options.customCell[index].handlerParam[0]],ele[eleCol],index)}>{options.customCell[index].buttonText}</button> </td>
                                                    }
                                                }
                                                if(options.headers[eleColInd]?.toLowerCase().indexOf('date')>-1)
                                                {
                                                    return <td key={ele[eleCol] + Math.random() * 1000} >{common.getDateTime(common.getValueFromObject(eleCol, ele)?.toString())}</td>
                                                }
                                                else
                                                return <td key={ele[eleCol] + Math.random() * 1000} >{common.getValueFromObject(eleCol, ele)?.toString()}</td>
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
