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
          <div>
            {this.props.dataUser.islogin ? (
              <button className="log-button" onClick={this.onLogoutClick}>
                Logout
              </button>
            ) : (
              <Link to="/login" className="normal-link">
                <button className="log-button">Login</button>
              </Link>
            )}
          </div>
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
