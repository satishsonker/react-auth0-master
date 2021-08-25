import React from 'react'
import '../css/LeftMenu.css';
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
export default function LeftMenu() {   
    const {logout}=useAuth0();
    return (
        <div>
           <ul className="left-menu">
              <Link to="/Dashboard"><li className="item"><i className="fas fa-tachometer-alt"></i> Dashboard</li></Link> 
              <Link to="/Device"><li className="item"><i className="fa fa-microchip"></i> Device</li></Link> 
              <Link to="/"><li className="item"><i className="fa fa-cubes"></i> Device Template</li></Link> 
              <Link to="/Credentials"><li className="item"><i className="fa fa-unlock-alt"></i> Credentials</li></Link> 
              <Link to="/Rooms"><li className="item"><i className="fa fa-clone"></i> Rooms</li></Link> 
              <Link to="/"><li className="item"><i className="fas fa-play-circle-o"></i> Scenes</li></Link> 
              <Link to="/"><li className="item"><i className="fa fa-calendar"></i> Schedules</li></Link> 
              <Link to="/"><li className="item"><i className="fa fa-history"></i> Activity Log</li></Link> 
              <Link to="/"><li className="item"><i className="fa fa-flash"></i> Energy Estimates</li></Link> 
              <Link to="/"><li className="item"><i className="fa fa-clone"></i> Rooms</li></Link> 
              <Link to="/"><li className="item"><i className="fa fa-user-circle-o"></i> Account</li></Link> 
              <Link to="/"><li className="item"><i className="fa fa-usd"></i> Subscription</li></Link> 
              <Link to="/"><li className="item"><i className="fa fa-bell-o"></i> What's New</li></Link> 
              <Link to="/"><li className="item"><i className="fa fa-expand"></i> API Integration</li></Link> 
              <Link to="/developers"><li className="item"><i className="fa fa-expand"></i> Developers</li></Link> 
              <li className="item"  onClick={()=> logout()}><i className="fa fa-sign-out"></i> Sign out</li>
           </ul>
           <div className="toggle-button">
               <i className="fa fa-fw fa-angle-double-left"></i>&nbsp; 
               <span>Collapse Sidebar</span>
               </div>
        </div>
    )
}
