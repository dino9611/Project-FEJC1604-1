import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { LogoutAction } from "../redux/actions";
import { ButtonBase } from "@material-ui/core";
import {
  DropdownItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { API_URL } from "../helper";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Badge from "@material-ui/core/Badge";
import HistoryIcon from "@material-ui/icons/History";
import ModalCH from "./ModalCH";
import "./styles/Header.css";

class Header extends Component {
  state = {
    isOpenModalCH: false,
    isOpen: false,
    transaction: [],
  };

  componentDidMount() {
    // console.log("ini data user", this.props.dataUser);
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
          <div className="header-brand">
            Fournir<span className="dot-header">.</span>{" "}
          </div>
        </Link>

        <div className="header-menu">
          <div className="menu">
            <Link to="/collection" className="normal-link-header">
              <ButtonBase
                disableRipple
                style={{
                  width: "100px",
                  backgroundColor: "none",
                  color: "#052c43",
                  fontWeight: "bold",
                  fontSize: "15px",
                  padding: 10,
                }}
              >
                Collection
              </ButtonBase>
            </Link>
          </div>

          {this.props.dataUser.islogin && this.props.dataUser.role === 1 ? (
            <div className="menu-islogin">
              <Link
                to="/cart"
                className="normal-link-header"
                style={{
                  width: "60px",
                  color: "#052c43",
                  fontWeight: "bold",
                  fontSize: "17px",
                  padding: 10,
                }}
              >
                <Badge
                  badgeContent={this.props.dataUser.cart.length}
                  color="secondary"
                >
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </Link>

              <Link
                to="/payment"
                className="normal-link-header"
                style={{
                  width: "60px",
                  color: "#052c43",
                  fontWeight: "bold",
                  fontSize: "17px",
                  padding: 10,
                }}
              >
                <Badge
                  badgeContent={this.props.dataUser.transaction.length}
                  color="secondary"
                >
                  <AccountBalanceWalletOutlinedIcon />
                </Badge>
              </Link>

              <Link
                to="/history"
                className="normal-link-header"
                style={{
                  width: "60px",
                  color: "#052c43",
                  fontWeight: "bold",
                  fontSize: "17px",
                  padding: 10,
                }}
              >
                <HistoryIcon />
              </Link>

              <Link
                to="/wishlist"
                className="normal-link-header"
                style={{
                  width: "60px",
                  color: "#052c43",
                  fontWeight: "bold",
                  fontSize: "17px",
                  padding: 10,
                }}
              >
                <FavoriteBorderIcon />
              </Link>
            </div>
          ) : null}

          {this.props.dataUser.islogin && this.props.dataUser.role === 1 ? (
            <React.Fragment>
              <div className="menu-islogin">
                <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                  <DropdownToggle
                    className="dropdown-header"
                    tag="a"
                    size="15px"
                    style={{
                      textDecoration: "none",
                      color: "gray",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        fontSize: "14px",
                        paddingTop: 3,
                        fontWeight: 600,
                      }}
                    >
                      <div>
                        <img
                          src={API_URL + this.props.dataUser.photo}
                          style={{
                            height: "30px",
                            width: "30px",
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                          alt="profile-picture"
                        />
                      </div>
                      <div
                        style={{
                          marginLeft: "15px",
                          marginTop: "3px",
                          cursor: "pointer",
                        }}
                      >
                        <span>{this.props.dataUser.username}</span>
                      </div>
                    </div>
                  </DropdownToggle>
                  <DropdownMenu>
                    <Link
                      to="/userprofile"
                      style={{ textDecoration: "none", color: "#052c43" }}
                    >
                      <DropdownItem>My Profile</DropdownItem>
                    </Link>
                    <DropdownItem divider />
                    <Link
                      to="/"
                      className="normal-link-header"
                      onClick={this.onLogoutClick}
                      style={{ color: "#052c43" }}
                    >
                      <DropdownItem>Logout</DropdownItem>
                    </Link>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </React.Fragment>
          ) : null}

          <div className="menu">
            {this.props.dataUser.islogin ? null : (
              <Link to="/login" className="normal-link-header">
                <ButtonBase
                  disableRipple
                  style={{
                    width: "100px",
                    backgroundColor: "none",
                    color: "#052c43",
                    fontWeight: "bold",
                    fontSize: "15px",
                    padding: 10,
                  }}
                >
                  Login
                </ButtonBase>
              </Link>
            )}
          </div>

          <div className="menu">
            {this.props.dataUser.islogin ? null : (
              <Link to="/registration" className="normal-link-header">
                <ButtonBase
                  disableRipple
                  style={{
                    width: "120px",
                    backgroundColor: "#052c43",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginLeft: "18px",
                    padding: 10,
                  }}
                >
                  Sign up
                  <ArrowForwardIcon style={{ fontSize: "17px", marginLeft: "10px", marginTop: "3px" }} />
                </ButtonBase>
              </Link>
            )}
          </div>

          <ModalCH
            openCH={this.state.isOpenModalCH}
            closeCH={this.onCloseClick}
          />
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
