import React, { Component } from "react";
import {
  FormControl,
  InputBase,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputAdornment,
  IconButton,
  ButtonBase,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { FaFacebookF } from "react-icons/fa";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { RegActionThunk, ResetActionthunk } from "../../redux/actions";
import LoaderComp from "../../components/Loader";
import googleIcon from "../../search.svg";
import "../styles/userRegister.css";

class Registration extends Component {
  state = {
    isVisible: false,
    isVisibleConf: false,
    radioMale: false,
    radioFemale: false,
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    gender: "",
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataUser.sendemail !== this.props.dataUser.sendemail) {
      this.setState({
        isVisible: false,
        isVisibleConf: false,
        radioMale: false,
        radioFemale: false,
        username: "",
        password: "",
        email: "",
        gender: "",
        confirmPassword: "",
      });
      // console.log('test')
    }
    // console.log(prevProps)
  }

  visToggle = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  visConfToggle = () => {
    this.setState({ isVisibleConf: !this.state.isVisibleConf });
  };

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    // console.log(e.target)
  };

  onRadioInput = (e) => {
    this.setState({
      gender: e.currentTarget.value,
    });
  };

  onRegistSubmit = (e) => {
    e.preventDefault();
    const { username, password, confirmPassword, email, gender } = this.state;
    let data = {
      username,
      password,
      confirmPassword,
      email,
      gender,
    };
    this.props.RegActionThunk(data);
    // console.log(data);
  };

  onReset = () => {
    this.setState({
      isVisible: false,
      isVisibleConf: false,
      username: "",
      password: "",
      email: "",
      gender: "",
      confirmPassword: "",
    });
  };

  render() {
    if (this.props.dataUser.islogin) {
      return <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        {this.props.dataUser.loading ? <LoaderComp /> : null}
        <div className="regist-content">
          <div className="left-content-regist">
            <img alt="bg-register" />
          </div>
          <div className="right-content-regist">
            <div className="regist-form">
              <h1 className="login-text-1">Sign Up</h1>
              <p className="regist-text-2">
                We are in Business to Improve Lives. Please live with the best
                comfort.
              </p>
              {this.props.dataUser.error ? (
                <Alert severity="error" style={{ marginBottom: "10px" }}>
                  {this.props.dataUser.error}
                </Alert>
              ) : null}

              {this.props.dataUser.sendemail ? (
                <Alert severity="success" style={{ marginBottom: "10px" }}>
                  {this.props.dataUser.sendemail}
                </Alert>
              ) : null}

              <form onSubmit={this.onRegistSubmit} autoComplete="off">
                <div className="regist-form-1">
                  <FormControl
                    style={{
                      width: "100%",
                      flex: 1,
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
                      value={this.state.username}
                      onChange={this.onInputChange}
                      type="text"
                      name="username"
                      placeholder="Username"
                    />
                  </FormControl>
                  <div style={{ width: "10px" }}></div>
                  <FormControl
                    style={{
                      width: "100%",
                      flex: 1,
                    }}
                  >
                    <RadioGroup row aria-label="position" defaultValue="top">
                      <FormControlLabel
                        style={{ marginLeft: "1px" }}
                        onChange={this.onRadioInput}
                        checked={this.state.radioMale}
                        onClick={() => {
                          this.setState({
                            radioMale: !this.state.radioMale,
                            radioFemale: false,
                          });
                        }}
                        value="male"
                        name="gender"
                        control={<Radio color="red" />}
                        label="Male"
                      />
                      <FormControlLabel
                        onChange={this.onRadioInput}
                        checked={this.state.radioFemale}
                        onClick={() => {
                          this.setState({
                            radioFemale: !this.state.radioFemale,
                            radioMale: false,
                          });
                        }}
                        value="female"
                        name="gender"
                        control={<Radio color="red" />}
                        label="Female"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div>
                  <FormControl
                    style={{
                      width: "100%",
                      flex: 1,
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
                      value={this.state.email}
                      onChange={this.onInputChange}
                      type="email"
                      name="email"
                      placeholder="E-mail"
                    />
                  </FormControl>
                </div>
                <div className="regist-form-1">
                  <FormControl
                    style={{
                      width: "100%",
                      flex: 1,
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
                  <div style={{ width: "10px" }}></div>
                  <FormControl
                    style={{
                      width: "100%",
                      flex: 1,
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
                      value={this.state.confirmPassword}
                      onChange={this.onInputChange}
                      type={this.state.isVisibleConf ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={this.visConfToggle}
                          >
                            {this.state.isVisibleConf ? (
                              <AiFillEye
                                style={{ color: "#052C43", fontSize: "21px" }}
                                onClick={this.visConfToggle}
                              />
                            ) : (
                              <AiFillEyeInvisible
                                style={{ color: "#9f9f9f", fontSize: "21px" }}
                                onClick={this.visConfToggle}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </div>
                <p
                  style={{
                    textAlign: "start",
                    marginTop: "20px",
                    marginBottom: "20px",
                    fontSize: "15px",
                    color: "#535353",
                  }}
                >
                  Have Account?
                  <Link
                    to="/login"
                    style={{
                      textDecoration: "none",
                      color: "#89ADC3",
                    }}
                  >
                    <span onClick={this.props.ResetActionthunk}> Login</span>
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
                      this.state.password &&
                        this.state.email &&
                        this.state.confirmPassword
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
                  Sign Up
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
                    Continue with Facebook
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
                    Continue with Google
                  </ButtonBase>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};

export default connect(MaptstatetoProps, {
  RegActionThunk,
  ResetActionthunk,
})(Registration);
