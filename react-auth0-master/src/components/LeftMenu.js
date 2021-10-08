import React, { useState } from 'react'
import '../css/LeftMenu.css';
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
export default function LeftMenu({ setIsMenuCollapsed, userRole }) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { logout } = useAuth0();
    const handleCollapsed = () => {
        setIsCollapsed(!isCollapsed);
        setIsMenuCollapsed(!isCollapsed);
    }
    return (
        <div>
            <ul className={!isCollapsed ? "left-menu" : " left-menu left-menu-small"}>
                <Link title="Dashboard" to="/Dashboard"><li className="item"><i className="fas fa-tachometer-alt"></i> {!isCollapsed && ('Dashboard')} </li></Link>
                <Link title="Device" to="/Device"><li className="item"><i className="fa fa-microchip"></i> {!isCollapsed && ('Device')} </li></Link>
                {/* <Link to="/"><li className="item"><i className="fa fa-cubes"></i> {!isCollapsed && ('Device Template')} </li></Link> */}
                <Link title="Credential" to="/Credentials"><li className="item"><i className="fa fa-unlock-alt"></i> {!isCollapsed && ('Credentials')} </li></Link>
                <Link title="Room" to="/Rooms"><li className="item"><i className="fa fa-clone"></i> {!isCollapsed && ('Rooms')} </li></Link>
                <Link title="Scenes" to="/Scenes"><li className="item"><i className="far fa-play-circle"></i> {!isCollapsed && ('Scenes')} </li></Link>
                <Link title="Schedule" to="/"><li className="item"><i className="fa fa-calendar"></i> {!isCollapsed && ('Schedules')} </li></Link>
                <Link title="Activity Log" to="/activitylog"><li className="item"><i className="fa fa-history"></i> {!isCollapsed && ('Activity Log')} </li></Link>
                {/* <Link to="/"><li className="item"><i className="fa fa-flash"></i> {!isCollapsed && ('Energy Estimates')} </li></Link> */}
                <Link title="Account" to="/Account"><li className="item"><i className="fas fa-user-circle"></i> {!isCollapsed && ('Account')} </li></Link>
                {/* <Link to="/"><li className="item"><i className="fa fa-usd"></i> {!isCollapsed && ('Subscription')} </li></Link> */}
                <Link title="What's New" to="/"><li className="item"><i className="fas fa-bell"></i> {!isCollapsed && ("What's New")} </li></Link>
                {/* <Link to="/"><li className="item"><i className="fa fa-expand"></i> {!isCollapsed && ('API Integration')} </li></Link> */}
                <Link title="Developers" to="/developers"><li className="item"><i className="fas fa-chalkboard-teacher"></i> {!isCollapsed && ('Developers')} </li></Link>
                {
                    userRole?.isAdmin && 
                    <>
                        <Link title="Device Type" to="/admin/devicetype"><li className="item"><i className="fas fa-chalkboard-teacher"></i> {!isCollapsed && ('Device Type')} </li></Link>
                        <Link title="Device Action" to="/admin/deviceaction"><li className="item"><i className="fas fa-chalkboard-teacher"></i> {!isCollapsed && ('Device Action')} </li></Link>
                        <Link title="Admin Permission" to="/admin/adminPermission"><li className="item"><i className="fas fa-chalkboard-teacher"></i> {!isCollapsed && ('Admin Permission')} </li></Link>
                        <Link title="Device Capability" to="/admin/DeviceCapability"><li className="item"><i className="fas fa-file-invoice"></i> {!isCollapsed && ('Device Capability')} </li></Link>
                        <Link title="Master Data" to="/admin/MasterData"><li className="item"><i className="fas fa-file-invoice"></i> {!isCollapsed && ('Master Data')} </li></Link>
                    </>
                }
                <li title="Sign out" className="item" onClick={() => logout()}><i className="fas fa-sign-out-alt"></i> {!isCollapsed && ('Sign out')} </li>
            </ul>
            <div className={!isCollapsed ? 'toggle-button' : 'toggle-button toggle-button-small'} onClick={e => { handleCollapsed() }}>
                <i className={isCollapsed === false ? 'fa fa-fw fa-angle-double-left' : 'fa fa-fw fa-angle-double-right'}></i>&nbsp;
                <span>{!isCollapsed && ('Collapse')}</span>
            </div>
        </div>
    )
}
