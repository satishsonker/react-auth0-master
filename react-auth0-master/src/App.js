import React, { useState, useEffect } from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import LandingPage from './components/LandingPage'
import Header from './components/Header';
import LeftMenu from './components/LeftMenu';
import {
  BrowserRouter as Router,
  Switch, Route
} from "react-router-dom";
import Dashboard from './components/Dashboard/Dashboard';
import Device from './components/Device';
import Credentials from './components/Credentials';
import Rooms from './components/Rooms';
import RoomCreate from './components/RoomCreate';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../src/css/loader.css";
import DeviceCreate from './components/DeviceCreate';
import Developers from './components/Developers';
import Account from './components/Account';
import Scenes from './components/Scenes';
import SceneCreate from './components/SceneCreate';
import ActivityLog from './components/ActivityLog';
import { Api } from "../src/Configurations/Api";
import { common } from "../src/Configurations/common";
import DeviceType from './components/Admin/DeviceType';
import DeviceTypeCreate from './components/Admin/DeviceTypeCreate';
import DeviceAction from './components/Admin/DeviceAction';
import DeviceActionCreate from './components/Admin/DeviceActionCreate';
import AdminPermission from './components/Admin/AdminPermission';
import Loader from './components/Loader';
import DeviceCapability from './components/Admin/DeviceCapability';
import DeviceCapabilityCreate from './components/Admin/DeviceCapabilityCreate';
toast.configure();
function App() {
  const apiUrlData = require('../src/Configurations/apiUrl.json');
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);
  const { isLoading, isAuthenticated, user } = useAuth0();
  const [userRole, setuserRole] = useState(common.getDefault(common.dataType.object));
  if (isAuthenticated && user) {
    window.iotGlobal = common.getDefault(common.dataType.object);
    window.iotGlobal["userKey"] = user.sub.split("|")[1];
  }
  useEffect(() => {
    if (isAuthenticated && user) {
      let UserData = {
        "Firstname": user?.given_name,
        "Lastname": user?.family_name,
        "Email": user?.email,
        "UserKey": user?.sub.split("|")[1],
        "AuthProvidor": user?.sub.split("|")[0],
        "Language": user?.locale
      };
      let ApiCalls = common.getDefault(common.dataType.array);
      ApiCalls.push(Api.Get(apiUrlData.userLocation, false));
      ApiCalls.push(Api.Get(apiUrlData.userController.getUserPermission));
      ApiCalls.push(Api.Post(apiUrlData.userController.addUser, UserData));
      Api.MultiCall(ApiCalls).then(res => {
        debugger;
        setuserRole(res[1].data);
        var locData = res[0].data;
        if (window?.iotGlobal?.userKey !== undefined)
          Api.Post(apiUrlData.activityLogController.add, {
            ipAddress: locData.IPv4,
            location: locData?.city + '-' + locData.country_name + "(" + locData.country_code + ")",
            appName: common.getAppName(),
            activity: 'Login',
            userKey: window?.iotGlobal?.userKey
          })
      });
    }

  });


  if (!isAuthenticated) {
    return <LandingPage></LandingPage>
  }
  if (isLoading) { return <Loader></Loader> }
  return (
    <>
      <div>
        <Router>
          <Header />
          <LeftMenu setIsMenuCollapsed={setIsMenuCollapsed} userRole={userRole} />
          <div className={!isMenuCollapsed ? 'view-container' : 'view-container view-container-small'}>
            <Switch>
              <Route exact path="/Dashboard" render={() => {
                return (
                  <div><Dashboard userRole={userRole}></Dashboard></div>
                );
              }}></Route>
              <Route exact path="/Device" render={() => {
                return (
                  <div><Device userRole={userRole}></Device></div>
                );
              }}></Route>
              <Route exact path="/Credentials" render={() => {
                return (
                  <div><Credentials userRole={userRole}></Credentials></div>
                );
              }}></Route>
              <Route exact path="/Rooms" render={() => {
                return (
                  <div><Rooms userRole={userRole}></Rooms></div>
                );
              }}></Route>
              <Route exact path="/RoomCreate" render={() => {
                return (
                  <div><RoomCreate userRole={userRole}></RoomCreate></div>
                );
              }}></Route>
              <Route exact path="/DeviceCreate" render={() => {
                return (
                  <div><DeviceCreate userRole={userRole}></DeviceCreate></div>
                );
              }}></Route>
              <Route exact path="/Developers" render={() => {
                return (
                  <div><Developers userRole={userRole}></Developers></div>
                );
              }}></Route>
              <Route exact path="/Account" render={() => {
                return (
                  <div><Account userRole={userRole}></Account></div>
                );
              }}></Route>
              <Route exact path="/Scenes" render={() => {
                return (
                  <div><Scenes userRole={userRole}></Scenes></div>
                );
              }}></Route>
              <Route exact path="/SceneCreate" render={() => {
                return (
                  <div><SceneCreate userRole={userRole}></SceneCreate></div>
                );
              }}></Route>
              <Route exact path="/activitylog" render={() => {
                return (
                  <div><ActivityLog userRole={userRole}></ActivityLog></div>
                );
              }}></Route>
              <Route exact path="/admin/deviceType" render={() => {
                return (
                  <div><DeviceType userRole={userRole}></DeviceType></div>
                );
              }}></Route>
              <Route exact path="/admin/deviceTypeCreate" render={() => {
                return (
                  <div><DeviceTypeCreate></DeviceTypeCreate></div>
                );
              }}></Route>
              <Route exact path="/admin/deviceAction" render={() => {
                return (
                  <div><DeviceAction userRole={userRole}></DeviceAction></div>
                );
              }}>
              </Route>
              <Route exact path="/admin/deviceActionCreate" render={() => {
                return (
                  <div><DeviceActionCreate userRole={userRole}></DeviceActionCreate></div>
                );
              }}>
              </Route>
              <Route exact path="/admin/AdminPermission" render={() => {
                return (
                  <div><AdminPermission userRole={userRole}></AdminPermission></div>
                );
              }}>
              </Route>
              <Route exact path="/admin/DeviceCapability" render={() => {
                return (
                  <div><DeviceCapability userRole={userRole}></DeviceCapability></div>
                );
              }}>
              </Route>
              <Route exact path="/admin/DeviceCapabilityCreate" render={() => {
                return (
                  <div><DeviceCapabilityCreate userRole={userRole}></DeviceCapabilityCreate></div>
                );
              }}>
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </>
  );
}

export default App;
