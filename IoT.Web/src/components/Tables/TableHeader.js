import React, { useState } from 'react'
import { common } from '../../Configurations/common'
import { Link } from "react-router-dom";
export default function TableHeader({ option, userRole }) {
    option = common.defaultIfEmpty(option, {});
    option.showAddButton = common.defaultIfEmpty(option.showAddButton, true);
    option.showSearchBar = common.defaultIfEmpty(option.showSearchBar, true);
    option.showRefreshButton = common.defaultIfEmpty(option.showRefreshButton, true);
    option.buttons = common.defaultIfEmpty(option.buttons, []);
    option.searchHandler = common.defaultIfEmpty(option.searchHandler, (val) => { });
    option.headerName = common.defaultIfEmpty(option.headerName, 'No Header Name');
    option.addUrl = common.defaultIfEmpty(option.addUrl, '#');
    option.addButtonName = common.defaultIfEmpty(option.addButtonName, "Add");
    option.searchPlaceHolder = common.defaultIfEmpty(option.searchPlaceHolder, "Search");
    const [searchTerm, setSearchTerm] = useState('');
    const searchHandler = (val) => {
        setSearchTerm(val);
        option.searchHandler(val);
    }
    return (
        <div className="d-flex justify-content-between bd-highlight mb-3 px-3">
            <div className="p-2 bd-highlight">
                <div className="btn-group" role="group" aria-label="Basic example">
                    {userRole?.canCreate && option.showAddButton && <Link to={option.addUrl}><div className="btn btn-sm btn-outline-primary"><i className="fa fa-plus"></i> {option.addButtonName}</div></Link>}
                    {userRole?.canView && option.showRefreshButton && <button type="button" onClick={e => searchHandler("All")} className="btn btn-sm btn-outline-primary"><i className="fa fa-sync-alt"></i></button>}
                    {
                        option.buttons.map((ele) => {
                            if (ele.type === 'link')
                                return <Link to={ele.url}><div className="btn btn-sm btn-outline-primary"><i className={ele.icon}></i> {ele.text}</div></Link>
                            else
                                return <button type="button" onClick={e => ele.handler(e)} className="btn btn-sm btn-outline-primary">{ele.text}<i className={ele.icon}></i></button>
                        })
                    }
                </div>
            </div>
            <div className="p-2 "><p className="h5">{option.headerName}</p></div>
            {option.showSearchBar && (
                <div className="p-2 bd-highlight">
                    <div className="input-group mb-3">
                        {userRole?.canView && (<input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-control form-control-sm" placeholder={option.searchPlaceHolder} aria-label={option.searchPlaceHolder} aria-describedby="button-addon2" />)}
                        {userRole?.canView && (<button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => searchHandler(searchTerm === '' ? 'All' : searchTerm)}><i className="fa fa-search"></i></button>)}
                    </div>
                </div>
            )}
        </div>
    )
}
