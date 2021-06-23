import React, { Component } from 'react';
import { Offline, Online } from "react-detect-offline";
import '../styles/adminLogin.css';
import Loader from "react-loader-spinner";
import { Form, Button } from 'react-bootstrap';
import { connect } from "react-redux";
import { LoginAdminActionThunk } from "../../redux/actions";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class LoginAdmin extends Component {
    state = {
        isVisible: false,
        password: "",
        emailorusername: ""
    };

    toggle = () => {
        this.setState({ isVisible: !this.state.isVisible });
    };

    onInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onLoginSubmit = (e) => {
        e.preventDefault();
        const { emailorusername, password } = this.state;
        if (!emailorusername || !password) {
            toast.error('Input can not be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        let data = {
            emailorusername: emailorusername,
            password: password,
        };
        console.log(data);
        this.props.LoginAdminActionThunk(data);
    };

    render() {
        if (this.props.dataAdmin.islogin) {
            return <Redirect to='/admin/home' />;
        }
        return (
            <div className="app">
                <header className="app-header">
                    <form onSubmit={this.onLoginSubmit}>
                        <h1>Login Admin</h1>
                        <input
                            type="text"
                            className="form-control my-2"
                            placeholder="email/username"
                            name="emailorusername"
                            onChange={this.onInputChange}
                        />
                        <input
                            type="password"
                            className="form-control my-2"
                            placeholder="password"
                            name="password"
                            onChange={this.onInputChange}
                        />
                        <button type="submit" className="btn btn-primary mt-3">
                            Login
                        </button>
                    </form>
                </header>
                <ToastContainer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        dataAdmin: state.Auth
    };
};

export default connect(mapStateToProps, { LoginAdminActionThunk })(LoginAdmin);