// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import { BiCog } from "react-icons/bi";
import { FaUserAlt, FaPen } from "react-icons/fa";
// import { AiFillHeart } from "react-icons/ai";
// import { CgNotes } from "react-icons/cg";
import { BsFillLockFill } from "react-icons/bs";
import "../pages/styles/userProfile.css";
import { AiFillHome } from "react-icons/ai";

import React, { Component } from "react";
import { ButtonBase } from "@material-ui/core";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import HomeIcon from "@material-ui/icons/Home";
import LockIcon from "@material-ui/icons/Lock";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import BallotIcon from "@material-ui/icons/Ballot";
import AssessmentIcon from "@material-ui/icons/Assessment";

class Sidebar extends Component {
  render() {
    return (
      <div>
        <div className="sidebar-user-profile">
          <div className="wh-sidebar-content">
            <div className="sidebar-content-1">
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "#535353",
                }}
              >
                <h1 className="home-sidebar">Fournir</h1>
              </Link>
            </div>
            <div className="wh-sb-content-2">
              <Link
                to="/userprofile"
                style={{
                  textDecoration: "none",
                  color: "#535353",
                }}
              >
                <ButtonBase
                  disableRipple
                  style={{
                    marginBottom: "27px",
                    fontSize: "18px",
                    color:
                      this.props.page === "profile" ? "#052c43" : "#b4b4b4",
                    fontWeight: "bold",
                  }}
                >
                  <EditIcon
                    style={{
                      marginRight: "20px",
                      color:
                        this.props.page === "profile" ? "#052c43" : "#b4b4b4",
                    }}
                  />
                  Edit Profile
                </ButtonBase>
              </Link>
              <Link
                to="/address"
                style={{
                  textDecoration: "none",
                  color: this.props.page === "address" ? "#052c43" : "#b4b4b4",
                }}
              >
                <ButtonBase
                  disableRipple
                  style={{
                    marginBottom: "27px",
                    fontSize: "18px",
                    color:
                      this.props.page === "address" ? "#052c43" : "#b4b4b4",
                    fontWeight: "bold",
                  }}
                >
                  <HomeIcon
                    style={{
                      marginRight: "20px",
                      color:
                        this.props.page === "address" ? "#052c43" : "#b4b4b4",
                    }}
                  />
                  Address
                </ButtonBase>
              </Link>
              <Link
                to="/security"
                style={{
                  textDecoration: "none",
                  color: this.props.page === "security" ? "#052c43" : "#b4b4b4",
                }}
              >
                <ButtonBase
                  disableRipple
                  style={{
                    marginBottom: "27px",
                    fontSize: "18px",
                    color:
                      this.props.page === "security" ? "#052c43" : "#b4b4b4",
                    fontWeight: "bold",
                  }}
                >
                  <LockIcon
                    style={{
                      marginRight: "20px",
                      color:
                        this.props.page === "security" ? "#052c43" : "#b4b4b4",
                    }}
                  />
                  Security
                </ButtonBase>
              </Link>
            </div>
          </div>
        </div>
        <div className="sidebar-content-2">
          <div style={{ backgroundColor: "white", height: "70px" }}>header</div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Sidebar;
