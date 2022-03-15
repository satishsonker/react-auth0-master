import React, { useState, useEffect } from 'react'
import { common } from '../../Configurations/common'

export default function TableFooter({ option, currPageNo, currPageSize, pagingData, totalRecords }) {
    option = common.defaultIfEmpty(option, {});
    option.totalRecord = common.defaultIfEmpty(option.totalRecord, 0);
    option.currPage = common.defaultIfEmpty(option.currPage, 1);
    option.pageSize = common.defaultIfEmpty(option.pageSize, common.getTablePageSize());
    const [totalPageCount, setTotalPageCount] = useState([1]);
    const [pageSize, setPageSize] = useState(common.defaultIfEmpty(currPageSize, 10));
    const [pageNo, setPageNo] = useState(common.defaultIfEmpty(currPageNo, 1));
    const [recordRange, setrecordRange] = useState("");
    useEffect(() => {
        totalRecords = common.defaultIfEmpty(totalRecords, 0);
        let totalPage = ((option.totalRecord === 0 ? totalRecords : option.totalRecord) / pageSize);
        let totalPages = [];
        if (totalPage > parseInt(totalPage)) {
            totalPage += 1;
        }
        for (let index = 1; index <= totalPage; index++) {
            totalPages.push(index);
        }
        setTotalPageCount(totalPages);
        setrecordRange(getRecordRange(pageNo, pageSize));
    }, [option.totalRecord, pageSize, totalRecords]);
    const handleChange = (e) => {
        let psize = parseInt(e.target.value);
        let data = { pageNo: 1, pageSize: psize, currPage: 1 }
        pagingData({ ...data });
        setPageSize(psize);
        setrecordRange(getRecordRange(1, psize));
    };
    const handleClick = (e, val) => {
        e.preventDefault();
        let pno = parseInt(val);
        let data = { pageNo: pno, pageSize: pageSize, currPage: pno };
        pagingData({ ...data });
        setPageNo(pno);
        setrecordRange(getRecordRange(pno, pageSize));
    };
    const handlePagingPre = () => {
        if (pageNo > 1) {
            pagingData({ pageNo: pageNo - 1, pageSize: pageSize });
            setPageNo(pageNo - 1);
            setrecordRange(getRecordRange(pageNo - 1, pageSize));
        }
    }
    const handlePagingNext = () => {
        if (pageNo < totalPageCount.length) {
            pagingData({ pageNo: pageNo + 1, pageSize: pageSize });
            setPageNo(pageNo + 1);
            setrecordRange(getRecordRange(pageNo + 1, pageSize));
        }
    }
    const getRecordRange = (pno, psize) => {
        let allRecords = (option.totalRecord === 0 ? totalRecords : option.totalRecord);
        let recordStart = ((pno - 1) * psize) + 1;
        let recordEnd = recordStart - 1 + (psize > allRecords ? allRecords : psize);
        recordEnd = recordEnd > allRecords ? allRecords : recordEnd;
        return `${recordStart}-${recordEnd}`;
    }
    return (
        <>

            <div className="row mx-0">
                <div className="col-md-12 col-12" style={{borderTop:"1px solid #e7e7e7"}}>{(option.totalRecord === 0 ? totalRecords : option.totalRecord) > 0 && (
                    <div className="d-flex justify-content-between">

                        <div className="p-2 bd-highlight">
                            {totalPageCount.length > 1 && (
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination  pagination-sm">
                                        <li onClick={() => handlePagingPre()} className={pageNo == 1 ? "page-item disabled" : "page-item"}>
                                            <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
                                        </li>
                                        {
                                            totalPageCount.map((ele) => {
                                                return <li key={ele} onClick={(e) => { handleClick(e, ele) }} className={pageNo == ele ? "page-item active" : "page-item"}><a className="page-link" href="#">{ele}</a></li>
                                            })
                                        }
                                        <li onClick={() => handlePagingNext()} className={pageNo == totalPageCount.length || totalPageCount.length == 1 ? "page-item disabled" : "page-item"}>
                                            <a className="page-link" href="#">Next</a>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                        <div className="p-2 bd-highlight">
                            {totalPageCount.length > 1 && (
                                <strong> {recordRange}/{(option.totalRecord === 0 ? totalRecords : option.totalRecord)}</strong>
                            )}
                        </div>


                        <div className="p-2 bd-highlight">
                            <select className="form-control" onChange={(e) => handleChange(e)}>
                                {
                                    option.pageSize.map((ele) => {
                                        if (currPageSize === ele)
                                            return <option key={ele} defaultValue={true} value={ele}>{ele}</option>
                                        return <option key={ele} value={ele}>{ele}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                )}</div>
            </div>
        </>
    )
}
