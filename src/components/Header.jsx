import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { LogoutAction } from "../redux/actions";
import ModalCH from "./ModalCH";
import "./styles/Header.css";

class Header extends Component {
  state = {
    isOpenModalCH: false,
  };



  onLogoutClick = () => {
    localStorage.removeItem("TA");
    localStorage.removeItem("TR");
    localStorage.removeItem("data");
    this.props.LogoutAction();
  };

  onCloseClick = () => {
    this.setState({ isOpenModalCH: false });
  };

  render() {
    return (
      <div className="header-bg">
        <Link to="/" className="normal-link-header">
          <div className="header-brand">Fournir</div>
        </Link>
        <div className="header-menu">
          <Link to="/collection" className="normal-link-header">
            <a>Collection</a>
          </Link>
          {this.props.dataUser.islogin ? (
            <Link to="/cart" className="normal-link-header">
              <a>Cart</a>
            </Link>
          ) : (
            <a
              style={{ cursor: "pointer" }}
              onClick={() => this.setState({ isOpenModalCH: true })}
            >
              Cart
            </a>
          )}

          {this.props.dataUser.islogin ? (
            <Link to="/history" className="normal-link-header">
              <a>History</a>
            </Link>
          ) : (
            <a
              style={{ cursor: "pointer" }}
              onClick={() => this.setState({ isOpenModalCH: true })}
            >
              History
            </a>
          )}

          <div>
            {this.props.dataUser.islogin ? (
              <Link to="/" className="normal-link-header">
                <button className="log-button" onClick={this.onLogoutClick}>
                  Logout
                </button>
              </Link>
            ) : (
              <Link to="/login" className="normal-link-header">
                <button className="log-button">Login</button>
              </Link>
            )}
          </div>

          <ModalCH open={this.state.isOpenModalCH} close={this.onCloseClick} />
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

export default connect(MaptstatetoProps, { LogoutAction })(Header);
