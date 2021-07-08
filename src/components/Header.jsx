import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { LogoutAction } from "../redux/actions";
import ModalCH from "./ModalCH";
import "./styles/Header.css";
import { FaShoppingCart } from "react-icons/fa";
import { API_URL } from "../helper";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "reactstrap";

class Header extends Component {
  state = {
    isOpenModalCH: false,
    isOpen: false,
  };

  componentDidMount() {
    console.log("ini data user", this.props.dataUser);
  }

  onLogoutClick = () => {
    localStorage.removeItem("TA");
    localStorage.removeItem("TR");
    localStorage.removeItem("data");
    this.props.LogoutAction();
  };

  onCloseClick = () => {
    this.setState({ isOpenModalCH: false });
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <div className="header-bg">
        <Link to="/" className="normal-link-header">
          <div className="header-brand">Fournir</div>
        </Link>
        <div className="header-menu">
          <Link
            to="/collection"
            className="normal-link-header"
            style={{
              marginRight: "30px",
              letterSpacing: "1px",
              fontSize: "20px",
            }}
          >
            <a>Collection</a>
          </Link>
          {
            this.props.dataUser.islogin && this.props.dataUser.role === 1 ? (
              <Fragment style={{ marginRight: "15px" }}>
                <Link to="/cart" className="normal-link-header">
                  <FaShoppingCart style={{ fontSize: "20px" }} />
                </Link>
                {this.props.dataUser.cart.length ? (
                  <Badge
                    pill
                    style={{
                      background: "#89ADC3",
                      position: "relative",
                      bottom: 7,
                      right: 7,
                    }}
                  >
                    {this.props.dataUser.cart.length}
                  </Badge>
                ) : null}
              </Fragment>
            ) : null
            // <div style={{ cursor: "pointer" }} onClick={() => this.setState({ isOpenModalCH: true })}>
            //   <FaShoppingCart style={{ fontSize: '20px', marginRight: '30px' }} />
            // </div>
          }
          <div>
            {this.props.dataUser.islogin ? null : (
              <Link to="/login" className="normal-link-header">
                <button className="log-button">Login</button>
              </Link>
            )}
          </div>
          <div>
            {this.props.dataUser.islogin ? null : (
              <Link to="/registration">
                <button className="signup-button">Sign Up</button>
              </Link>
            )}
          </div>
          {this.props.dataUser.islogin && this.props.dataUser.role === 1 ? (
            <Dropdown
              isOpen={this.state.isOpen}
              toggle={this.toggle}
              style={{ outline: "none" }}
            >
              <DropdownToggle
                caret
                className="dropdown-header"
                tag="a"
                size="20px"
              >
                <img
                  src={API_URL + this.props.dataUser.photo}
                  style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "50%",
                  }}
                  alt="profile-picture"
                />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <Link
                    to="/userprofile"
                    style={{ textDecoration: "none", color: "#052c43" }}
                  >
                    My Profile
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link
                    to="/history"
                    style={{ textDecoration: "none", color: "#052c43" }}
                  >
                    History
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link
                    to="/payment"
                    style={{ textDecoration: "none", color: "#052c43" }}
                  >
                    Payment
                  </Link>{" "}
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <Link
                    to="/"
                    className="normal-link-header"
                    onClick={this.onLogoutClick}
                    style={{ color: "#052c43" }}
                  >
                    Log Out
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : null}
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
