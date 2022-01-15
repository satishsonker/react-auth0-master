import React, { useState, useEffect } from 'react'
import { common } from '../../Configurations/common'

export default function TableFooter({ option, currPageNo, currPageSize, pagingData }) {
    option = common.defaultIfEmpty(option, {});
    option.totalRecord = common.defaultIfEmpty(option.totalRecord, 0);
    option.currPage = common.defaultIfEmpty(option.currPage, 1);
    option.pageSize = common.defaultIfEmpty(option.pageSize, common.getTablePageSize());
    const [totalPageCount, setTotalPageCount] = useState([1]);
    const [pageSize, setPageSize] = useState(common.defaultIfEmpty(currPageSize, 10));
    const [pageNo, setPageNo] = useState(common.defaultIfEmpty(currPageNo, 1));
    useEffect(() => {
        debugger;
        let totalPage = option.totalRecord / pageSize;
        let totalPages = [];
        if (totalPage > parseInt(totalPage)) {
            totalPage += 1;
        }
        for (let index = 1; index <= totalPage; index++) {
            totalPages.push(index);
        }
        setTotalPageCount(totalPages);
    }, [option.totalRecord, pageSize]);
    const handleChange = (e) => {
        let data = { pageNo: 1, pageSize: parseInt(e.target.value), currPage: 1 }
        pagingData(data);
        setPageSize(parseInt(e.target.value));
    };
    const handleClick = (e, val) => {
        let data = { pageNo: parseInt(val), pageSize: pageSize, currPage: parseInt(val) };
        pagingData(data);
        setPageNo(parseInt(val));
        e.preventDefault();
    };
    const handlePagingPre = () => {
        if (pageNo > 1) {
            pagingData({ pageNo: pageNo - 1, pageSize: pageSize });
            setPageNo(pageNo - 1);
        }
    }
    const handlePagingNext = () => {
        if (pageNo < totalPageCount.length) {
            pagingData({ pageNo: pageNo + 1, pageSize: pageSize });
            setPageNo(pageNo + 1);
        }
    }
    return (
        <>
            <div className="row">
                <div className="col-md-12 col-12">
                    <div className="position-relative px-3">
                        <div className="position-absolute top-0 start-0">
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
                        </div>
                        <div className="position-absolute top-0 end-0">
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
                </div>
            </div>
        </>
    )
}
