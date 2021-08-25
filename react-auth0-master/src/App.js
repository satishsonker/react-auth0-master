import React from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import LandingPage from './components/LandingPage'
import Header from './components/Header';
import LeftMenu from './components/LeftMenu';
import {
  BrowserRouter as Router,
  Switch, Route
} from "react-router-dom";
import Dashboard from './components/Dashboard';
import Device from './components/Device';
import Credentials from './components/Credentials';
import Rooms from './components/Rooms';
import RoomCreate from './components/RoomCreate';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../src/css/loader.css";
import DeviceCreate from './components/DeviceCreate';
import Developers from './components/Developers';
toast.configure();
function App() {
  const { isLoading, isAuthenticated, user } = useAuth0();
  if (isAuthenticated && user) {
    window.iotGlobal = {};
    window.iotGlobal["userKey"] = user.sub.split("|")[1];
  }

  if (!isAuthenticated) {
    return <LandingPage></LandingPage>
  }
  else if (isLoading) { return <div>Loading...</div> }
  else {
    return (
      <>
        <div>
          <Router>
            <Header />
            <LeftMenu />
            <div className="view-container">
              <Switch>
                <Route exact path="/Dashboard" render={() => {
                  return (
                    <div><Dashboard></Dashboard></div>
                  );
                }}></Route>
                <Route exact path="/Device" render={() => {
                  return (
                    <div><Device></Device></div>
                  );
                }}></Route>
                <Route exact path="/Credentials" render={() => {
                  return (
                    <div><Credentials></Credentials></div>
                  );
                }}></Route>
                <Route exact path="/Rooms" render={() => {
                  return (
                    <div><Rooms></Rooms></div>
                  );
                }}></Route>
                <Route exact path="/RoomCreate" render={() => {
                  return (
                    <div><RoomCreate></RoomCreate></div>
                  );
                }}></Route>
                <Route exact path="/DeviceCreate" render={() => {
                  return (
                    <div><DeviceCreate></DeviceCreate></div>
                  );
                }}></Route>
                <Route exact path="/Developers" render={() => {
                  return (
                    <div><Developers></Developers></div>
                  );
                }}></Route>
              </Switch>
            </div>
          </Router>

        </div>
      </>
    );
  }
}

export default App;
