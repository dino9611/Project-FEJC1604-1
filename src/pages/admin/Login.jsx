import React, { Component } from "react";
import { connect } from "react-redux";
import { LoginAdminActionThunk, ResetActionthunk } from "../../redux/actions";
import { Redirect, Link } from "react-router-dom";
import LoaderComp from "../../components/Loader";
import { Container } from "reactstrap";
import "../styles/adminLogin.css";
import { AiFillEye } from "react-icons/ai";
import AlertAdmin from "../../components/AlertAdmin";
import Alert from "@material-ui/lab/Alert";

class LoginAdmin extends Component {
  state = {
    isVisible: false,
    password: "",
    emailOrUsername: "",
    loading: false,
    openSnack: false,
    message: "",
    alertStatus: "success",
    open: true,
  };

  toggle = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  handleSnack = () => {
    this.setState({ openSnack: false, message: "", alertStatus: "success" });
  };

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onLoginSubmit = (e) => {
    e.preventDefault();
    const { emailOrUsername, password } = this.state;
    let dataLogin = {
      emailOrUsername: emailOrUsername,
      password: password,
    };
    console.log(dataLogin);
    this.props.LoginAdminActionThunk(dataLogin);
  };

  render() {
    if (this.props.dataAdmin.islogin) {
      return <Redirect to="/admin/dashboard/transaction" />;
    }
    return (
      <div className="div-luar">
        {this.state.loading ? <LoaderComp /> : null}
        <div className="login-header">
          <Link to="/" className="fournir-text">
            Fournir
          </Link>
        </div>
        <Container>
          <div className="form-login">
            <form
              onSubmit={this.onLoginSubmit}
              autoComplete="off"
              className="content-dalam"
            >
              <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <h1 style={{ color: "#052C43", fontWeight: "bold" }}>
                  Fournir Admin
                </h1>
              </div>
              {this.props.dataAdmin.error ? (
                <Alert severity="error" style={{ marginBottom: "10px" }}>
                  {this.props.dataAdmin.error}
                </Alert>
              ) : null}
              <div>
                <div className="login-box-1">
                  <div style={{ width: "100%" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="email/username"
                      name="emailOrUsername"
                      onChange={this.onInputChange}
                      value={this.state.emailOrUsername}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: "15px",
                      width: "100%",
                      display: "flex",
                    }}
                  >
                    <input
                      type="password"
                      className="form-control"
                      placeholder="password"
                      name="password"
                      onChange={this.onInputChange}
                      value={this.state.password}
                    />
                    <span></span>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="login-btn"
                      onClick={this.props.ResetActionthunk}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Container>
        <AlertAdmin
          openSnack={this.state.openSnack}
          handleSnack={this.handleSnack}
          message={this.state.message}
          status={this.state.alertStatus}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataAdmin: state.Auth,
  };
};

export default connect(mapStateToProps, {
  LoginAdminActionThunk,
  ResetActionthunk,
})(LoginAdmin);
