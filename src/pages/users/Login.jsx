import React, { Component } from "react";
import {
  FormControl,
  InputBase,
  InputAdornment,
  IconButton,
  ButtonBase,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { LoginActionThunk, ResetActionthunk } from "../../redux/actions";
import "../styles/userLogin.css";
import googleIcon from "../../search.svg";
import Loader from "react-loader-spinner";

class Login extends Component {
  state = {
    isVisible: false,
    password: "",
    emailorusername: "",
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
    this.props.LoginActionThunk(data);
  };

  render() {
    if (this.props.dataUser.islogin) {
      return <Redirect to="/" />;
    }
    return (
      <>
        {this.props.dataUser.loading ? (
          <div className="login-loading">
            <Loader
              type="TailSpin"
              color="#052C43"
              height={100}
              width={100}
              timeout={5000}
            />
          </div>
        ) : null}

        <div className="login-content">
          <div className="left-content-login">
            <div className="login-form">
              <h1 className="login-text-1">Login to Fournir</h1>
              <p className="login-text-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              {this.props.dataUser.error ? (
                <Alert severity="error" style={{ marginBottom: "10px" }}>
                  {this.props.dataUser.error}
                </Alert>
              ) : null}
              <form onSubmit={this.onLoginSubmit} autoComplete="off">
                <FormControl
                  style={{
                    width: "100%",
                  }}
                >
                  <InputBase
                    style={{
                      backgroundColor: "white",
                      borderRadius: 0,
                      outline: "none",
                      padding: 10,
                      fontSize: "15px",
                      paddingLeft: 18,
                    }}
                    value={this.state.emailorusername}
                    onChange={this.onInputChange}
                    type="emailorusername"
                    name="emailorusername"
                    placeholder="Username or email"
                  />
                </FormControl>
                <FormControl
                  style={{
                    width: "100%",
                    paddingTop: "10px",
                  }}
                >
                  <InputBase
                    style={{
                      backgroundColor: "white",
                      borderRadius: 0,
                      outline: "none",
                      padding: 10,
                      fontSize: "15px",
                      paddingLeft: 18,
                    }}
                    value={this.state.password}
                    onChange={this.onInputChange}
                    type={this.state.isVisible ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.visToggle}
                        >
                          {this.state.isVisible ? (
                            <AiFillEye
                              style={{ color: "#052C43", fontSize: "21px" }}
                              onClick={this.visToggle}
                            />
                          ) : (
                            <AiFillEyeInvisible
                              style={{ color: "#9f9f9f", fontSize: "21px" }}
                              onClick={this.visToggle}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <p
                  style={{
                    textAlign: "end",
                    marginTop: "10px",
                    marginBottom: "24px",
                    fontSize: "15px",
                  }}
                >
                  <Link
                    to="/forgotPassword"
                    style={{
                      textDecoration: "none",
                      color: "#535353",
                    }}
                  >
                    Forgot Password
                  </Link>
                </p>
                <ButtonBase
                  type="submit"
                  onClick={this.props.ResetActionthunk}
                  submit={true}
                  disableRipple
                  style={{
                    width: "100%",
                    backgroundColor:
                      this.state.password && this.state.emailorusername
                        ? "#89ADC3"
                        : "#aec7d6",
                    color: "white",
                    borderRadius: 0,
                    padding: 17,
                    fontSize: "16px",
                    fontWeight: 600,
                    letterSpacing: 0.3,
                  }}
                >
                  Login
                </ButtonBase>
                <div className="divider center">
                  <hr />
                  <label>or</label>
                  <hr />
                </div>
                <div className="login-with">
                  <ButtonBase
                    type="submit"
                    submit={true}
                    disableRipple
                    style={{
                      width: "100%",
                      backgroundColor: "#3A5897",
                      color: "white",
                      borderRadius: 0,
                      padding: 17,
                      fontSize: "13px",
                    }}
                  >
                    <FaFacebookF
                      style={{ fontSize: "25px", marginRight: "10px" }}
                    />
                    Login with Facebook
                  </ButtonBase>
                  <div className="separator"></div>
                  <ButtonBase
                    type="submit"
                    submit={true}
                    disableRipple
                    style={{
                      width: "100%",
                      backgroundColor: "white",
                      color: "black",
                      borderRadius: 0,
                      padding: 17,
                      fontSize: "13px",
                    }}
                  >
                    <img
                      src={googleIcon}
                      alt="google-icon"
                      className="googleIcon"
                    />
                    Login with Google
                  </ButtonBase>
                </div>
              </form>
            </div>
          </div>
          <div className="right-content-login">
            <h1>right</h1>
          </div>
        </div>
      </>
    );
  }
}

const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};

export default connect(MaptstatetoProps, {
  LoginActionThunk,
  ResetActionthunk,
})(Login);
