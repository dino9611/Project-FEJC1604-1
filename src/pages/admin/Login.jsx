import React, { Component } from 'react';
import { connect } from "react-redux";
import { LoginAdminActionThunk } from "../../redux/actions";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderComp from '../../components/Loader';
import { Container } from 'reactstrap';
import '../styles/adminLogin.css';
import AiFillEye from 'react-icons/ai';


class LoginAdmin extends Component {
    state = {
        isVisible: false,
        password: "",
        emailOrUsername: "",
        loading: false
    };

    toggle = () => {
        this.setState({ isVisible: !this.state.isVisible });
    };

    onInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onLoginSubmit = (e) => {
        e.preventDefault();
        const { emailOrUsername, password } = this.state;
        if (!emailOrUsername || !password) {
            // alert(this.props.dataAdmin.error);
            toast.error('Input can not be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        let dataLogin = {
            emailOrUsername: emailOrUsername,
            password: password,
        };
        console.log(dataLogin);
        this.props.LoginAdminActionThunk(dataLogin);
    };

    render() {
        if (this.props.dataAdmin.islogin) {
            return <Redirect to='/admin/home' />;
        }
        return (
            <div className='div-luar'>
                {this.state.loading ? <LoaderComp /> : null}
                <div className='login-header'>
                    Fournir
                </div>
                <Container>
                    <div className='form-login'>
                        <form onSubmit={this.onLoginSubmit} autoComplete='off' className='content-dalam'>
                            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                <h1 style={{ color: '#052C43', fontWeight: 'bold' }}>Fournir Admin</h1>
                            </div>
                            <div>
                                <div className='login-box-1' >
                                    <div style={{ width: '100%' }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="email/username"
                                            name="emailOrUsername"
                                            onChange={this.onInputChange}
                                            value={this.state.emailOrUsername}
                                        />
                                    </div>
                                    <div style={{ marginTop: '15px', width: '100%', display: 'flex' }}>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="password"
                                            name="password"
                                            onChange={this.onInputChange}
                                            value={this.state.password}
                                        />
                                        <span>
                                        </span>
                                    </div>
                                    <div>
                                        <button type="submit" className="login-btn">
                                            Login
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </Container >
                <ToastContainer />
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        dataAdmin: state.Auth
    };
};

export default connect(mapStateToProps, { LoginAdminActionThunk })(LoginAdmin);