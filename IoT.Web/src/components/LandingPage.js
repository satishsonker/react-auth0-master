import { useAuth0 } from '@auth0/auth0-react';
import React from 'react'
import { Redirect } from "react-router-dom";
import "../css/landing.css";
export default function LandingPage() {
    const { loginWithRedirect, isLoading, user, isAuthenticated } = useAuth0();
    if (isAuthenticated) {
        window.iotGlobal = {};
        window.iotGlobal["userKey"] = user.sub.split("|")[1];
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-white">
                <div className="container-fluid ">
                    <a className="navbar-brand text-black" href="/">
                        <img src="/assets/images/logo64.png" alt="" width="32" height="32" className="d-inline-block align-text-top" />
                        <span style={{ paddingLeft: 10 + 'px' }}>Areana IoT</span>
                    </a>
                    <form className="d-flex">
                        {!isLoading && !user && (
                            <div>
                                <button className="btn btn-primary" onClick={() => loginWithRedirect()} >Login</button>
                            </div>
                        )}
                        {!isLoading && user && (
                            <div>
                                {JSON.stringify(user, null, 2)}
                                <Redirect to="/dashboard"></Redirect>
                            </div>
                        )}
                    </form>
                </div>
            </nav>
           
            <div className="card bg-dark text-white">
                <img src="/assets/images/iot-main.jpg" className="card-img" alt="..." />
                <div className="card-img-overlay">
                    <h1 className="card-text text-center card-text1">Home automation for everyone</h1>
                    <p className="card-text text-center card-text1">Simple way to control your IOT development boards like RaspberryPi, ESP8226, ESP32 or Arduino with Amazon Alexa, Google Home or SmartThings</p>
                    <p className="card-text text-center card-text1">
                        <button className="btn btn-primary">Sign Up</button>
                    </p>
                </div>
            </div>
            <div style={{textAlign:'center',paddingLeft:70+'px',paddingRight:70+'px'}}>
                <h1>How Areana IoT Works</h1>
                <hr/>
            </div>
        </div>
    )
}
