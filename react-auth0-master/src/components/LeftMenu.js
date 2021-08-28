import React, { useState } from 'react'
import '../css/LeftMenu.css';
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
export default function LeftMenu({setIsMenuCollapsed}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout } = useAuth0();
    const handleCollapsed=()=>{
        setIsCollapsed(!isCollapsed);
        setIsMenuCollapsed(!isCollapsed);
    }
    return (
        <div>
            <ul className={!isCollapsed?"left-menu":" left-menu left-menu-small"}>
                <Link to="/Dashboard"><li className="item"><i className="fas fa-tachometer-alt"></i>    <span>Dashboard</span> </li></Link>
                <Link to="/Device"><li className="item"><i className="fa fa-microchip"></i> {!isCollapsed && ('Device')} </li></Link>
                <Link to="/"><li className="item"><i className="fa fa-cubes"></i> {!isCollapsed && ('Device Template')} </li></Link>
                <Link to="/Credentials"><li className="item"><i className="fa fa-unlock-alt"></i> {!isCollapsed && ('Credentials')} </li></Link>
                <Link to="/Rooms"><li className="item"><i className="fa fa-clone"></i> {!isCollapsed && ('Rooms')} </li></Link>
                <Link to="/"><li className="item"><i className="fas fa-play-circle-o"></i> {!isCollapsed && ('Scenes')} </li></Link>
                <Link to="/"><li className="item"><i className="fa fa-calendar"></i> {!isCollapsed && ('Schedules')} </li></Link>
                <Link to="/"><li className="item"><i className="fa fa-history"></i> {!isCollapsed && ('Activity Log')} </li></Link>
                <Link to="/"><li className="item"><i className="fa fa-flash"></i> {!isCollapsed && ('Energy Estimates')} </li></Link>
                <Link to="/"><li className="item"><i className="fa fa-clone"></i> {!isCollapsed && ('Rooms')} </li></Link>
                <Link to="/Account"><li className="item"><i className="fa fa-user-circle-o"></i> {!isCollapsed && ('Account')} </li></Link>
                <Link to="/"><li className="item"><i className="fa fa-usd"></i> {!isCollapsed && ('Subscription')} </li></Link>
                <Link to="/"><li className="item"><i className="fa fa-bell-o"></i> {!isCollapsed && ("What's New")} </li></Link>
                <Link to="/"><li className="item"><i className="fa fa-expand"></i> {!isCollapsed && ('API Integration')} </li></Link>
                <Link to="/developers"><li className="item"><i className="fa fa-expand"></i> {!isCollapsed && ('Developers')} </li></Link>
                <li className="item" onClick={() => logout()}><i className="fa fa-sign-out"></i> {!isCollapsed && ('Sign out')} </li>
            </ul>
            <div className={!isCollapsed?'toggle-button':'toggle-button toggle-button-small'} onClick={e=>{handleCollapsed()}}>
                <i className={isCollapsed===false?'fa fa-fw fa-angle-double-left':'fa fa-fw fa-angle-double-right'}></i>&nbsp;
                <span>{!isCollapsed &&('Collapse')}</span>
            </div>
        </div>
    )
}
