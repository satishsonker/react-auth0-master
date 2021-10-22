import React from 'react'
import {
    BrowserRouter as Router,
    Switch, Route, Link
} from "react-router-dom";
import Login from '../WebComponents/Login';
import LandingPage from './LandingPage';
import  Auth0ProviderWithHistory  from "../auth0Provider";
import App from "../App";
import { useAuth0 } from "@auth0/auth0-react";
export default function Main() {
   const {user,isAuthenticated}=useAuth0();  
   if(isAuthenticated)
   { 
   window.iotGlobal={};
   window.iotGlobal["userKey"]=user.sub.split("|")[1];
   }
    return ( 
    <Auth0ProviderWithHistory>
        <Router>

            <Switch>
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
            </Switch>
        </Router>
        
        </Auth0ProviderWithHistory>
    )
}
