import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { API_URL } from '../../helper';
import '../styles/resetPassword.css';
import Header from '../../components/Header';
import resetPass from '../../images/reset-pass.jpg';
import { Link } from 'react-router-dom';
import AlertAdmin from '../../components/AlertAdmin';
import { ImArrowLeft2 } from 'react-icons/im';



class ResetPassword extends Component {
    state = {
        password: '',
        confirmPassword: '',
        openSnack: false,
        message: "",
        alertStatus: "",
        loading: false,
        resetPass: false
    };

    componentDidMount() {
        console.log(this.props.match.params.token);
    }

    onInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    backToHome = () => {
        this.setState({ resetPass: true });
    };


    onResetPassword = () => {
        const { password, confirmPassword } = this.state;
        let token = this.props.match.params.token;
        if (password !== confirmPassword) {
            this.setState({
                openSnack: true,
                alertStatus: 'warning',
                loading: false,
                message: 'New password and confirm password are different',
            });
        } else {
            let data = {
                newPassword: confirmPassword
            };
            axios.put(`${API_URL}/password/resetpassword`, data, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then((res) => {
                    console.log(res);
                    this.setState({
                        openSnack: true,
                        alertStatus: 'success',
                        loading: false,
                        message: 'Reset password success',
                        resetPass: true
                    });

                }).catch((error) => {
                    console.error(error);
                    this.setState({
                        openSnack: true,
                        alertStatus: 'error',
                        loading: false,
                        message: 'error',
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
                        {this.state.resetPass ?
                            <div>
                                <Link to='/'>
                                    <button className='backhome-click' onClick={this.backToHome}><ImArrowLeft2 /> Back To Home</button>
                                </Link>
                            </div>
                            :
                            <div>
                                <button className='reset-click' onClick={this.onResetPassword}>Reset Password</button>
                            </div>
                        }
                    </div>
                    <div className='kotak-reset-2'>
                        <img
                            src={resetPass}
                            // height='1000px'
                            width='100%'
                        />
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

export default ResetPassword;