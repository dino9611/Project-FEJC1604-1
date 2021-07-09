import React, { Component, Fragment } from 'react';
import { API_URL } from '../../helper/API';
import axios from 'axios';
import '../styles/forgot.css';
// import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import AlertAdmin from '../../components/AlertAdmin';



class ForgotPassword extends Component {
    state = {
        email: '',
        openSnack: false,
        message: "",
        alertStatus: "",
        loading: false,
        error: ''
    };

    onInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        // console.log(e.target.value);
    };

    onSendClick = () => {
        const email = this.state.email;
        const data = {
            email: email
        };
        if (!email) {
            this.setState({
                message: 'Please enter your email',
                openSnack: true,
                alertStatus: 'warning',
                loading: false
            });
        } else {
            axios.post(`${API_URL}/password/forgot`, data)
                .then((res) => {
                    this.setState({
                        email: '',
                        message: res.data.message,
                        openSnack: true,
                        alertStatus: 'success',
                        loading: false,
                    });
                }).catch((res, error) => {
                    console.log(res);
                    this.setState({
                        email: '',
                        message: 'Email unregistered',
                        openSnack: true,
                        alertStatus: 'error',
                        loading: false
                    });
                });
        }
    };

    handleSnack = () => {
        this.setState({ openSnack: false, message: '', alertStatus: '' });
    };

    render() {
        return (
            <Fragment>
                <Header />
                <div className='kotak-1'>
                    <div className='kotak-2'>
                        <div className='forgot'>
                            Forgot Password
                        </div>
                        <div className='email'>
                            Enter your email and we’ll send you a
                            link to reset your password
                        </div>
                        <div className='persegi'>
                            <input
                                type='email'
                                name='email'
                                placeholder='Enter your email address'
                                className='persegi-dalem'
                                value={this.state.email}
                                onChange={this.onInputChange}
                            />
                        </div>
                        <div>
                            <button className='send' onClick={this.onSendClick}>Send Email</button>
                        </div>
                        {/* <div className='back-home'>
                            <Link to='/' style={{ textDecoration: 'none' }}>
                                Back to Home
                            </Link>
                        </div> */}
                    </div>
                </div>
                <AlertAdmin
                    openSnack={this.state.openSnack}
                    handleSnack={this.handleSnack}
                    message={this.state.message}
                    status={this.state.alertStatus}
                />
            </Fragment>
        );
    }
}

export default ForgotPassword;