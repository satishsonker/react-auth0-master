import React, { useState, useEffect } from 'react'
import { common } from '../../Configurations/common'

export default function TableFooter({ option, pagingData }) {    
   
    option = common.defaultIfEmpty(option, {});
    option.totalRecord = common.defaultIfEmpty(option.totalRecord, 0);
    option.currPage = common.defaultIfEmpty(option.currPage, 1);
    option.pageSize = common.defaultIfEmpty(option.pageSize, [10, 20, 30, 40, 50, 100]);
    const [totalPageCount, setTotalPageCount] = useState([1]);
    const [pageSize, setPageSize] = useState(10);
    const [pageNo, setPageNo] = useState(option.currPage);
    useEffect(() => {
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
        pagingData({ pageNo: 1, pageSize: parseInt(e.target.value),currPage:1 });
        setPageSize(parseInt(e.target.value));
    };
    const handleClick = (e,val) => {
        pagingData({ pageNo: parseInt(val), pageSize: pageSize,currPage:pageNo });
        setPageNo(parseInt(val));        
        e.preventDefault();
    };
    const handlePagingPre = () => {
        if (pageNo > 1) {
            pagingData({ pageNo: pageNo-1, pageSize: pageSize });
            setPageNo(pageNo-1);
        }
    }
    const handlePagingNext = () => {
        if (pageNo < totalPageCount.length) {
            pagingData({ pageNo: pageNo+1, pageSize: pageSize });
            setPageNo(pageNo+1);
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
                                    <li onClick={()=>handlePagingPre()} className={pageNo == 1 ? "page-item disabled" : "page-item"}>
                                        <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
                                    </li>
                                    {
                                        totalPageCount.map((ele) => {
                                            return <li key={ele} onClick={(e) => { handleClick(e,ele) }} className={pageNo == ele ? "page-item active" : "page-item"}><a className="page-link" href="#">{ele}</a></li>
                                        })
                                    }
                                    <li  onClick={()=>handlePagingNext()} className={pageNo == totalPageCount.length || totalPageCount.length==1 ? "page-item disabled" : "page-item"}>
                                        <a className="page-link" href="#">Next</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="position-absolute top-0 end-0">
                            <select className="form-control" onChange={(e) => handleChange(e)}>
                                {
                                    option.pageSize.map((ele) => {
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
