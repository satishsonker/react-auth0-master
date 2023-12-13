import React from 'react'
import {
    BrowserRouter as Router,
    Routes, Route
} from "react-router-dom";
import LandingPage from './LandingPage';
import App from "../App";
export default function Main() {
   const {user,isAuthenticated}={isLoading:false,isAuthenticated:true,user:{name:'satish'}};  
   if(isAuthenticated)
   { 
   window.iotGlobal={};
   window.iotGlobal["userKey"]=user.sub.split("|")[1];
   }
    return ( 
        <Router>

        <Routes>
            <Route exact path="/" render={() => {
                return (
                  <LandingPage></LandingPage>
                );
            }}></Route>
            <Route exact path="/dashboard" render={() => {
                return (
                  <App></App>
                );
            }}></Route>
        </Routes>
    </Router>
    )
}
