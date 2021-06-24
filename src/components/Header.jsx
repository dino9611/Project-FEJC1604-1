import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { LogoutAction, ResetActionthunk } from "../redux/actions";
import "./styles/Header.css";

class Header extends Component {
  state = {};

  render() {
    return (
      <div className="header-bg">
        <Link to="/" className="normal-link">
          <div className="header-brand">Fournir</div>
        </Link>
        <div className="header-menu">
          <Link to="/" className="normal-link">
            <a>Home</a>
          </Link>
          <Link to="/collection" className="normal-link">
            <a>Collection</a>
          </Link>
          <a>Cart</a>
          <a>History</a>
          {this.props.dataUser.islogin ? (
            <a onClick={this.onLogoutClick}>Logout</a>
          ) : (
            <Link to="/login" className="normal-link">
              <a>Login</a>
            </Link>
          )}
        </div>
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
  ResetActionthunk,
})(Header);
