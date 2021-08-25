import { useAuth0 } from '@auth0/auth0-react';
import React from 'react'
import { Redirect } from "react-router-dom";
export default function LandingPage() {
    const { loginWithRedirect, isLoading, user, isAuthenticated } = useAuth0();
    if (isAuthenticated) {
        debugger;
        window.iotGlobal = {};
        window.iotGlobal["userKey"] = user.sub.split("|")[1];
    }
    return (

        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-white">
                <div className="container-fluid ">
                    <a className="navbar-brand text-black" href="/">
                        <img src="/docs/5.0/assets/brand/bootstrap-logo.svg" alt="" width="30" height="24" className="d-inline-block align-text-top" />
                        IoT - Automation
                    </a>
                    <form className="d-flex">
                        {!isLoading && !user && (
                            <div>
                                <button className="btn btn-success" onClick={() => loginWithRedirect()} >Login</button>
                                {JSON.stringify(user, null, 2)} </div>
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
        </div>
    )
}
