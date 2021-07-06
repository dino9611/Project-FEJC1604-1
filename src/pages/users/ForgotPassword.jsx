import React, { Component, Fragment } from 'react';
import { API_URL } from '../../helper/API';
import axios from 'axios';
// import { Alert } from "@material-ui/lab";
import '../styles/forgot.css';
// import { Link } from 'react-router-dom';
import Header from '../../components/Header';

class ForgotPassword extends Component {
    state = {
        email: ''
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
            alert('Email tidak boleh kosong');
        } else {
            axios.post(`${API_URL}/password/forgot`, data)
                .then((res) => {
                    console.log(res.data.message);
                    alert(res.data.message);
                    this.setState({ email: '' });
                }).catch((error) => {
                    alert(error.message);
                    console.error(error);
                    this.setState({ email: '' });
                });
        }
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
            </Fragment>
        );
    }
}

export default ForgotPassword;