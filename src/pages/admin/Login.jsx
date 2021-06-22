import React, { Component } from 'react';
import { Offline, Online } from "react-detect-offline";
import '../styles/adminLogin.css';
import Loader from "react-loader-spinner";
import { Form, Button } from 'react-bootstrap';
import { connect } from "react-redux";
import { LoginAdminActionThunk } from "../../redux/actions";
import { Redirect } from "react-router-dom";

class LoginAdmin extends Component {
    state = {
        isVisible: false,
        password: "",
        emailorusername: ""
    };

    visToggle = () => {
        this.setState({ isVisible: !this.state.isVisible });
    };

    onInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onLoginSubmit = (e) => {
        e.preventDefault();
        const { emailorusername, password } = this.state;
        let data = {
            emailorusername: emailorusername,
            password: password,
        };
        this.props.LoginAdminActionThunk(data);
    };

    render() {
        const { classes } = this.props;
        if (this.props.dataAdmin.islogin) {
            return <Redirect to="/" />;
        }
        return (
            <div className="app">
                <header className="app-header">
                    <Form>
                        <Form.Label>Fournir</Form.Label>
                        <Form.Group>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </header>
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