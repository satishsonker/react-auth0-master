import React from 'react'
import '../css/login.css'
import { Link } from "react-router-dom";
export default function Login() {
    return (
        <div class="container-fluid">
            <div class="row justify-content-md-center mx-auto">
                <div class="col-md-4" style={{ marginTop: 40 + 'px' }}>
                    <div class="container">
                        <form class="card">
                            <div class="card-body p-6">
                              <Link to="/"><div class="text-center mb-6">
                                    <img alt="Logo" class="d-inline-block mr-3" id="logo" style={{width:60+'px'}} src="./assets/images/iot-logo.png" />
                                    <h5 class="page-title">IoT - Automation</h5>
                                </div></Link> 
                                <hr />
                                <div class="form-group">
                                    <label class="form-label">Email address</label>
                                    <input class="form-control" formcontrolname="username" type="email" />
                                </div>
                                <div class="form-group">
                                    <label class="form-label"> Password <a class="float-right" href="/forgotpassword"><small>I forgot password</small> </a></label>
                                    <input class="form-control" formcontrolname="password" type="password" />
                                </div>
                                <div class="form-footer" style={{ marginTop: 40 + 'px' }}><button class="btn btn-primary btn-block w-100">Log in</button></div>
                            </div>
                        </form>
                        <div class="text-center text-muted" style={{ marginTop: 30 + 'px' }}> Don't have account yet? <a href="/register">Register</a></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
