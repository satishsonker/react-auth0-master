import React from 'react'
export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light header-color">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <a className="navbar-brand" href="#">
            <img src="/assets/images/logo64.png" alt="" width="30" height="30" className="d-inline-block align-text-top" />
            Areana IoT <span className="badge-small badge bg-success">v1.0.0</span>
          </a>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          </ul>
          <div className="float-end">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
            <a className="nav-link disabled" href="/" tabIndex="-1" aria-disabled="true"><i className="fab fa-youtube"></i></a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="/" tabIndex="-1" aria-disabled="true"><i className="fab fa-facebook"></i></a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="/" tabIndex="-1" aria-disabled="true"><i className="fab fa-github"></i></a>
            </li>
            <li className="nav-item">
            <a className="nav-link disabled" href="/" tabIndex="-1" aria-disabled="true"><i className="fab fa-android"></i></a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="/" tabIndex="-1" aria-disabled="true"><i className="fab fa-apple"></i></a>
            </li>
          </ul></div>
        </div>
      </div>
    </nav>
  )
}