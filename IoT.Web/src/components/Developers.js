import React from 'react'
import "../css/developers.css";

export default function Developers() {
    return (
        <div className="page-container">
            <div className="dev-body">
                <div className="dev-card">
                    <div className="imgbx">
                        <img  alt="Tester: Poonam Sonkar" src="/assets/images/dev-satish.jpg" />
                    </div>
                    <div className="dev-container">
                        <div className="dev-details">
                            <h2>Poonam Sonkar<br /><span>Tester</span></h2>
                            <ol className="sci">
                            <li><a href="/"><i className="fab fa-facebook-f"></i></a></li>
                            <li><a href="/"><i className="fab fa-twitter"></i></a></li>
                            <li><a href="/"><i className="fab fa-linkedin-in"></i></a></li>
                            <li><a href="/"><i className="fab fa-instagram"></i></a></li>
                        </ol>
                        </div>                        
                    </div>
                </div>
                <div className="dev-card">
                    <div className="imgbx">
                        <img alt="Developer: Satish Kumar Sonkar" src="/assets/images/dev-satish.jpg" />
                    </div>
                    <div className="dev-container">
                        <div className="dev-details">
                            <h2>Satish Kumar Sonker<br /><span>Developer</span></h2>
                            <ol className="sci">
                            <li><a href="/"><i className="fab fa-facebook-f"></i></a></li>
                            <li><a href="/"><i className="fab fa-twitter"></i></a></li>
                            <li><a href="/"><i className="fab fa-linkedin-in"></i></a></li>
                            <li><a href="/"><i className="fab fa-instagram"></i></a></li>
                        </ol>
                        </div>                        
                    </div>
                </div>
            
            </div>        
        </div>
    )
}
