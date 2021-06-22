import React, { Component } from 'react';
import '../styles/adminLogin.css';
import Loader from "react-loader-spinner";

class Login extends Component {
    state = {
        isVisible: false,
        password: "",
        emailorusername: ""
    };
    render() {
        return (
            <div>
                <div>Online</div>
                <div className="main-box" >
                    <div className="login-content">
                        <h1>Fournier Admin</h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;