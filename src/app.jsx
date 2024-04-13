import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Write } from './write/write';
import { Archive } from './archive/archive';
import './app.css';
import './mdb.min.css';

export default function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('username') || '');
    const loggedInNow = userName !== '';
    const [loggedIn, setLoggedIn] = React.useState(loggedInNow);

    return (
        <BrowserRouter>
            <div>
                <header> 
                    <nav id="headerPic" className="navbar navbar-expand-lg navbar-dark d-none d-lg-block">
                        <div className="container-fluid">
                            <NavLink className="navbar-brand nav-link" to="">
                                <strong>storyboard ninja</strong>
                            </NavLink>
                            <button className="navbar-toggler" type="button" data-mdb-collapse-init data-mdb-target="#navbarExample01"
                                aria-controls="navbarExample01" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="fas fa-bars"></i>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarExample01">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item active">
                                        <NavLink className="nav-link" aria-current="page" to="">home</NavLink>
                                    </li>
                                    {loggedIn === true && (
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="write">create!</NavLink>
                                    </li>)}
                                    {loggedIn === true && (
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="archive">archive</NavLink>
                                    </li>)}
                                </ul>

                                <ul className="navbar-nav d-flex flex-row">
                                    <li className="nav-item">
                                        <a id="currentUser" className="nav-link">{userName}</a>
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

                <Routes>
                    <Route path="/" element={<Login
                        loggedIn={loggedIn}
                        onAuthChange={(userName, loggedIn) => {
                            setUserName(userName);
                            setLoggedIn(loggedIn);
                        }} 
                     />} exact />
                    <Route path="write" element={<Write username={userName} />} />
                    <Route path="archive" element={<Archive />} />
                    <Route path="*" element={<NotFound />}/>
                </Routes>

                <footer className="bg-light text-lg-start">
                    <div className="text-center p-3">
                        Created 2024 by
                        <a className="text-dark" href="https://github.com/radmuffin/startup"> Daniel Spiesman</a>
                    </div>
                </footer>

            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className='text-center' style={{height: "90vh"}}>404: Return to sender. Address unknown.</main>;
  }

