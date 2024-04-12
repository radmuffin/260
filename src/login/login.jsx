import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export function Login({ loggedIn, onAuthChange }) {
    const navigate = useNavigate();

    const [message, setMessage] = React.useState('let us begin');

    async function login() {
        await loginOrCreate(`api/auth/login`);
    }
    
    async function create() {
        await loginOrCreate(`api/auth/create`);
    }

    async function loginOrCreate(endpoint) {
        const usernameEl = document.querySelector("#username");
        const passwordEl = document.querySelector("#password");
    
        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                username: usernameEl.value,
                password: passwordEl.value
            }),
            headers: { 'content-type': 'application/json; charset=UTF-8' },
        })
    
        if (response.ok) {
            localStorage.setItem("username", usernameEl.value);
            onAuthChange(usernameEl.value, true);
            setMessage(`we've been expecting you, ${usernameEl.value}`);
        } else {
            const body = await response.json();
            setMessage(`⚠ Error: ${body.msg}`);
        }
    
    }

    function logout() {
        localStorage.removeItem("username");
        onAuthChange('', false);
        fetch("api/auth/logout", { method: "delete" });
    }

    return (
        <main>
            <div id="intro" className="bg-image shadow-2-strong">
                <div className="mask">
                  <div className="container d-flex align-items-center justify-content-center text-center h-100">                    
                    <div className="text-white" data-mdb-theme="dark">
                      <h1 className="mb-3">welcome to the dojo!</h1>
                      <h5 className="mb-5" id="headerText">{message}</h5>
                      {loggedIn === false && (
                      <div id="signedOut">
                        <div className="form-outline" data-mdb-input-init>
                          <input type="text" id="username" className="form-control" />
                          <label className="form-label" >username:</label>
                        </div>
                        <div className="form-outline" data-mdb-input-init>
                          <input type="password" id="password" className="form-control" />
                          <label className="form-label" >password:</label>
                        </div>
                          <button type="submit" className="btn btn-primary btn-block mb-4" data-mdb-ripple-init onClick={() => login()}>sign in</button>
                          <button type="submit" className="btn btn-primary btn-block mb-4" data-mdb-ripple-init onClick={() => create()}>create user</button>
                      </div>)}
                      {loggedIn === true && (
                      <div id="signedIn">
                        <button type="submit" className="btn btn-primary btn-block mb-4" data-mdb-ripple-init onClick={() => navigate('/archive')}>write!</button>
                        <button type="submit" className="btn btn-primary btn-block mb-4" data-mdb-ripple-init onClick={() => logout()}>logout :'/</button>
                      </div>)}   
                    </div>                 
                  </div>
                </div>
            </div>
        </main>  
    );
}