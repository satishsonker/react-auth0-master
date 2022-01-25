import React, { useEffect, useState } from 'react'
import '../css/LeftMenu.css';
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { common } from '../Configurations/common';
export default function LeftMenu({ setIsMenuCollapsed, userRole }) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { logout } = useAuth0();
    const [selectedMenu, setSelectedMenu] = useState(window.location.pathname);
    const handleCollapsed = () => {
        setIsCollapsed(!isCollapsed);
        setIsMenuCollapsed(!isCollapsed);
    }
    useEffect(() => {
        setSelectedMenu(window.location.pathname);
    }, [selectedMenu])
    const changeMenuSelection=(val)=>{
        val=common.defaultIfEmpty(val,"");
        setSelectedMenu(val);
    }
    return (
        <div>
            <ul className={!isCollapsed ? "left-menu" : " left-menu left-menu-small"}>
                <Link title="Dashboard" to="/Dashboard"><li onClick={e=>changeMenuSelection("/Dashboard")} className={selectedMenu==="/Dashboard"?"selected item":"item"}><i className="fas fa-tachometer-alt"></i> {!isCollapsed && ('Dashboard')} </li></Link>
                <Link title="Device" to="/Device"><li onClick={e=>changeMenuSelection("/Device")} className={selectedMenu==="/Device"?"selected item":"item"}><i className="fa fa-microchip"></i> {!isCollapsed && ('Device')} </li></Link>
                {/* <Link to="/"><li onClick={e=>changeMenuSelection()} className={selectedMenu===""?"selected item":"item"}><i className="fa fa-cubes"></i> {!isCollapsed && ('Device Template')} </li></Link> */}
                <Link title="Credential" to="/Credentials"><li onClick={e=>changeMenuSelection("/Credentials")} className={selectedMenu==="/Credentials"?"selected item":"item"}><i className="fa fa-unlock-alt"></i> {!isCollapsed && ('Credentials')} </li></Link>
                <Link title="Room" to="/Rooms"><li onClick={e=>changeMenuSelection("/Rooms")} className={selectedMenu==="/Rooms"?"selected item":"item"}><i className="fa fa-clone"></i> {!isCollapsed && ('Rooms')} </li></Link>
                <Link title="Groups" to="/Groups"><li onClick={e=>changeMenuSelection("/Groups")} className={selectedMenu==="/Groups"?"selected item":"item"}><i className="fas fa-object-ungroup"></i> {!isCollapsed && ('Groups')} </li></Link>
                <Link title="Scenes" to="/Scenes"><li onClick={e=>changeMenuSelection("/Scenes")} className={selectedMenu==="/Scenes"?"selected item":"item"}><i className="far fa-play-circle"></i> {!isCollapsed && ('Scenes')} </li></Link>
                <Link title="Schedule" to="/"><li onClick={e=>changeMenuSelection("")} className={selectedMenu===""?"selected item":"item"}><i className="fa fa-calendar"></i> {!isCollapsed && ('Schedules')} </li></Link>
                <Link title="Activity Log" to="/activitylog"><li onClick={e=>changeMenuSelection("/activitylog")} className={selectedMenu==="/activitylog"?"selected item":"item"}><i className="fa fa-history"></i> {!isCollapsed && ('Activity Log')} </li></Link>
                {/* <Link to="/"><li onClick={e=>changeMenuSelection()} className={selectedMenu===""?"selected item":"item"}><i className="fa fa-flash"></i> {!isCollapsed && ('Energy Estimates')} </li></Link> */}
                <Link title="Account" to="/Account"><li onClick={e=>changeMenuSelection("/Account")} className={selectedMenu==="/Account"?"selected item":"item"}><i className="fas fa-user-circle"></i> {!isCollapsed && ('Account')} </li></Link>
                {/* <Link to="/"><li onClick={e=>changeMenuSelection()} className={selectedMenu===""?"selected item":"item"}><i className="fa fa-usd"></i> {!isCollapsed && ('Subscription')} </li></Link> */}
                <Link title="What's New" to="/"><li onClick={e=>changeMenuSelection("")} className={selectedMenu===""?"selected item":"item"}><i className="fas fa-bell"></i> {!isCollapsed && ("What's New")} </li></Link>
                {/* <Link to="/"><li onClick={e=>changeMenuSelection()} className={selectedMenu===""?"selected item":"item"}><i className="fa fa-expand"></i> {!isCollapsed && ('API Integration')} </li></Link> */}
                <Link title="Developers" to="/developers"><li onClick={e=>changeMenuSelection("/developers")} className={selectedMenu==="/developers"?"selected item":"item"}><i className="fas fa-chalkboard-teacher"></i> {!isCollapsed && ('Developers')} </li></Link>
                {
                    userRole?.isAdmin && 
                    <>
                        <Link title="Device Type" to="/admin/devicetype"><li onClick={e=>changeMenuSelection("/admin/devicetype")} className={selectedMenu==="/admin/devicetype"?"selected item":"item"}><i className="fas fa-bezier-curve"></i> {!isCollapsed && ('Device Type')} </li></Link>
                        <Link title="Device Action" to="/admin/deviceaction"><li onClick={e=>changeMenuSelection("/admin/deviceaction")} className={selectedMenu==="/admin/deviceaction"?"selected item":"item"}><i className="fas fa-fire"></i> {!isCollapsed && ('Device Action')} </li></Link>
                        <Link title="Admin Permission" to="/admin/adminPermission"><li onClick={e=>changeMenuSelection("/admin/adminPermission")} className={selectedMenu==="/admin/adminPermission"?"selected item":"item"}><i className="fas fa-users-cog"></i> {!isCollapsed && ('Admin Permission')} </li></Link>
                        <Link title="Device Capability" to="/admin/DeviceCapability"><li onClick={e=>changeMenuSelection("/admin/DeviceCapability")} className={selectedMenu==="/admin/DeviceCapability"?"selected item":"item"}><i className="fas fa-microchip"></i> {!isCollapsed && ('Device Capability')} </li></Link>
                        <Link title="Master Data" to="/admin/MasterData"><li onClick={e=>changeMenuSelection("/admin/MasterData")} className={selectedMenu==="/admin/MasterData"?"selected item":"item"}><i className="fas fa-file-invoice"></i> {!isCollapsed && ('Master Data')} </li></Link>
                    </>
                }
                <li onClick={e=>changeMenuSelection()} title="Sign out" className={selectedMenu===""?"selected item":"item"} onClick={() => logout()}><i className="fas fa-sign-out-alt"></i> {!isCollapsed && ('Sign out')} </li>
            </ul>
            <div className={!isCollapsed ? 'toggle-button' : 'toggle-button toggle-button-small'} onClick={e => { handleCollapsed() }}>
                <i className={isCollapsed === false ? 'fa fa-fw fa-angle-double-left' : 'fa fa-fw fa-angle-double-right'}></i>&nbsp;
                <span>{!isCollapsed && ('Collapse')}</span>
            </div>
        </div>
    )
}
