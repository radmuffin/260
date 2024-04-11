import React from 'react';
import './app.css';
import './mdb.min.css';

export default function App() {
    return (
        <div>
            <header> 
                <nav id="headerPic" className="navbar navbar-expand-lg navbar-dark d-none d-lg-block">
                    <div className="container-fluid">
                        <a className="navbar-brand nav-link" href="index.html">
                            <strong>storyboard ninja</strong>
                        </a>
                        <button className="navbar-toggler" type="button" data-mdb-collapse-init data-mdb-target="#navbarExample01"
                            aria-controls="navbarExample01" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-bars"></i>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarExample01">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item active">
                                    <a className="nav-link" aria-current="page" href="index.html">home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="write.html">create!</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="archive.html">archive</a>
                                </li>
                            </ul>

                            <ul className="navbar-nav d-flex flex-row">
                                <li className="nav-item">
                                    <a id="currentUser" className="nav-link"></a>
                                </li>
                                <li className="nav-item me-3 me-lg-0">
                                    <a className="nav-link" href="https://github.com/radmuffin/startup">
                                        <i className="fab fa-github"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>    
            </header>

            <main>app components go here</main>

            <footer className="bg-light text-lg-start">
                <div className="text-center p-3">
                    Created 2024 by
                    <a className="text-dark" href="https://github.com/radmuffin/startup"> Daniel Spiesman</a>
                </div>
            </footer>

        </div>
    );
}