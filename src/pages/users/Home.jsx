import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { LogoutAction, ResetActionthunk } from "../../redux/actions";

class Home extends Component {
  onLogout = (e) => {
    this.props.LogoutAction();
  };

  render() {
    return (
      <div>
        {this.props.dataUser.islogin ? (
          <div>
            <h1>Home Login</h1>
            <button onClick={this.onLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <h1>Home</h1>
            <button>
              <Link
                onClick={this.props.ResetActionthunk}
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#535353",
                }}
              >
                Login
              </Link>
            </button>
            <button>
              <Link
                onClick={this.props.ResetActionthunk}
                to="/registration"
                style={{
                  textDecoration: "none",
                  color: "#535353",
                }}
              >
                Sign Up
              </Link>
            </button>
          </div>
        )}
      </div>
    );
  }
}

const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};

export default connect(MaptstatetoProps, {
  LogoutAction,
  ResetActionthunk
})(Home);
