import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { API_URL } from '../../helper';
import '../styles/resetPassword.css';
import Header from '../../components/Header';
import resetPass from '../../images/reset-pass.jpg';
// import { Alert, AlertTitle } from "@material-ui/lab";
import { Redirect } from 'react-router-dom';

class ResetPassword extends Component {
    state = {
        password: '',
        confirmPassword: ''
    };

    componentDidMount() {
        console.log(this.props.match.params.token);
    }

    onInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };


    onResetPassword = () => {
        const { password, confirmPassword } = this.state;
        let token = this.props.match.params.token;
        if (password !== confirmPassword) {
            alert('confirm pass tidak sama');
        } else {
            let data = {
                newPassword: confirmPassword
            };
            axios.put(`${API_URL}/password/resetpassword`, data, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then((res) => {
                    console.log(res);
                    alert('berhasil');
                    <Redirect to='/' />;
                }).catch((error) => {
                    console.error(error);
                });
        }
    };

    render() {
        return (
            <Fragment>
                <Header />
                <div className='kotak-utama'>
                    <div className='kotak-reset-1'>
                        <div className='judul-1'>
                            Please reset your password
                        </div>
                        <div className='kotak-pass'>
                            <label style={{ color: 'gray' }}>New Password:</label>
                            <input
                                type='password'
                                name='password'
                                className='kotak-newpass'
                                onChange={this.onInputChange}
                                value={this.state.password}
                            />
                        </div>
                        <div className='kotak-pass'>
                            <label style={{ color: 'gray' }}>Confirm New Password:</label>
                            <input
                                type='password'
                                name='confirmPassword'
                                className='kotak-newpass'
                                onChange={this.onInputChange}
                                value={this.state.confirmPassword}
                            />
                        </div>
                        <div>
                            <button className='reset-click' onClick={this.onResetPassword}>Reset Password</button>
                        </div>
                    </div>
                    <div className='kotak-reset-2'>
                        <img
                            src={resetPass}
                            // height='1000px'
                            width='1000px'
                        />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default ResetPassword;