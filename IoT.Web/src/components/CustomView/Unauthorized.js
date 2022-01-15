import React from 'react'

export default function Unauthorized() {
    return (
        <div className="card text-center">
            <div className="card-header bg-warning">
            <i className="fas fa-exclamation-triangle"></i> Unauthorized
            </div>
            <div className="card-body">
                <h5 className="card-title">Action Not Allowed</h5>
                <h4 className="card-text">Unauthorised or not have permission to access this resource</h4>
                <a href="/" className="btn btn-primary">Go Dashboard</a>
            </div>
        </div>
    )
}
