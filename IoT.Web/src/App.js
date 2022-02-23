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
import MasterData from './components/Admin/MasterData';
import MasterDataCreate from './components/Admin/MasterDataCreate';
import MqttConnection from './components/Mqtt/MqttConnection';
import Groups from './components/Groups/Groups';
import GroupCreate from './components/Groups/GroupCreate';
import GroupAddDevice from './components/Groups/GroupAddDevice';
import GroupDetails from './components/Groups/GroupDetails';
import FavouriteDevice from './components/FavouriteDevice';
import EmailTemplateCreate from './components/Admin/EmailTemplateCreate';
import EmailTemplate from './components/Admin/EmailTemplate';
import EmailSetting from './components/Admin/EmailSetting';
import DropdownMasterCreate from './components/Admin/DropdownMasterCreate';
import DropdownMaster from './components/Admin/DropdownMaster';
toast.configure();
function App() {
  const apiUrlData = require('../src/Configurations/apiUrl.json');
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);
  const { isLoading, isAuthenticated, user } = useAuth0();
  const [userRole, setuserRole] = useState(common.getDefault(common.dataType.object));
  const [mqttConnectionStatus, setMqttConnectionStatus] = useState(null);
  const [mqttClient, setMqttClient] = useState();
  const [mqttPayload, setMqttPayload] = useState();
  const [mqttSubscribeTopic, setMqttSubscribeTopic] = useState([]);
  const [pubMsg, setPubMsg] = useState(null)
  if (isAuthenticated && user) {
    window.iotGlobal = common.getDefault(common.dataType.object);
    window.iotGlobal["userKey"] = user.sub.split("|")[1];
  }
  useEffect(() => {
    if (isAuthenticated && user) {
    Api.Get(apiUrlData.userController.getApiKey).then(res => {      
      setMqttSubscribeTopic([res.data.apiKey+'/server']);
    }).catch(err=>{
      toast.error(common.toastMsg.error);
    });
  }
  }, [isAuthenticated])
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
      Api.Get(apiUrlData.userController.getUserPermission).then(res => {
        setuserRole(res.data);
      }).catch(err=>{
        toast.error(common.toastMsg.error);
      });
      // if (window?.iotGlobal?.userKey !== undefined) {
      //   Api.Get(apiUrlData.userLocation, false).then(res => {
      //     var locData = res.data;
      //     Api.Post(apiUrlData.activityLogController.add, {
      //       ipAddress: locData.IPv4,
      //       location: locData?.city + '-' + locData.country_name + "(" + locData.country_code + ")",
      //       appName: common.getAppName(),
      //       activity: 'Login',
      //       userKey: window?.iotGlobal?.userKey
      //     });
      //   }).catch(err=>{
      //     toast.error(common.toastMsg.error);
      //   });;
      // }
      Api.Post(apiUrlData.userController.addUser, UserData).then(res => {
        console.table(res.data);
      }).catch(err=>{
        toast.error(common.toastMsg.error);
      });;
    }

  }, [isAuthenticated]);


  if (!isAuthenticated) {
    return <LandingPage></LandingPage>
  }
  if (isLoading) { return <Loader></Loader> }
  return (
    <>
      <MqttConnection mqttClient={setMqttClient} pubMsg={pubMsg} connectionStatus={setMqttConnectionStatus} setPayload={setMqttPayload} mqttSubscribeTopic={mqttSubscribeTopic}></MqttConnection>
      <div>
        <Router>
          <Header />
          <LeftMenu setIsMenuCollapsed={setIsMenuCollapsed} userRole={userRole} />
          <div className={!isMenuCollapsed ? 'view-container' : 'view-container view-container-small'}>
            <Switch>
              <Route exact path="/Dashboard" render={() => {
                return (
                  <div><Dashboard setPubMsg={setPubMsg} userRole={userRole} mqttPayload={mqttPayload}></Dashboard></div>
                );
              }}></Route>
              <Route exact path="/" render={() => {
                return (
                  <div><Dashboard setPubMsg={setPubMsg} userRole={userRole} mqttPayload={mqttPayload}></Dashboard></div>
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
              <Route exact path="/admin/MasterData" render={() => {
                return (
                  <div><MasterData userRole={userRole}></MasterData></div>
                );
              }}>
              </Route>
              <Route exact path="/admin/MasterDataCreate" render={() => {
                return (
                  <div><MasterDataCreate userRole={userRole}></MasterDataCreate></div>
                );
              }}>
              </Route>
              <Route exact path="/admin/EmailTemplate" render={() => {
                return (
                  <div><EmailTemplate userRole={userRole}></EmailTemplate></div>
                );
              }}>
              </Route>
              <Route exact path="/admin/EmailTemplateCreate" render={() => {
                return (
                  <div><EmailTemplateCreate userRole={userRole}></EmailTemplateCreate></div>
                );
              }}>
              </Route>
              <Route exact path="/admin/EmailSettings" render={() => {
                return (                  
                  <div><EmailSetting userRole={userRole}></EmailSetting></div>
                );
              }}>
              </Route>
              <Route exact path="/admin/dropdownMasterCreate" render={() => {
                return (  
                  <div><DropdownMasterCreate userRole={userRole}></DropdownMasterCreate></div>
                );
              }}>
              </Route>
              <Route exact path="/admin/dropdownMaster" render={() => {
                return (  
                  <div><DropdownMaster userRole={userRole}></DropdownMaster></div>
                );
              }}>
              </Route>
              <Route exact path="/Groups" render={() => {
                return (
                  <div><Groups userRole={userRole} setPubMsg={setPubMsg}></Groups></div>
                );
              }}>
              </Route>
              <Route exact path="/FavouriteDevice" render={() => {
                return (
                  <div><FavouriteDevice userRole={userRole} setPubMsg={setPubMsg} mqttPayload={mqttPayload}></FavouriteDevice></div>
                );
              }}>
              </Route>
              <Route exact path="/group/createGroup" render={() => {
                return (
                  <div><GroupCreate userRole={userRole}></GroupCreate></div>
                );
              }}>                
              </Route>
                 <Route exact path="/group/addDevice" render={() => {
                return (
                  <div><GroupAddDevice userRole={userRole}></GroupAddDevice></div>
                );
              }}></Route>
                 <Route exact path="/group/groupdetails" render={() => {
                return (
                  <div><GroupDetails userRole={userRole} setPubMsg={setPubMsg}></GroupDetails></div>
                );
              }}></Route>
            </Switch>
          </div>
        </Router>
      </div>
    </>
  );
}

export default App;
