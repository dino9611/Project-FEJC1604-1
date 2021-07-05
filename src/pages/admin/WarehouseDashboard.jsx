import React, { Component } from "react";
import { ButtonBase } from "@material-ui/core";
import { API_URL } from "../../helper";
import { Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { LogoutAction } from "../../redux/actions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DraftsIcon from "@material-ui/icons/Drafts";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import Transaction from "./Transaction";
import Processing from "./Processing";
import RequestStock from "./RequestStock";
import axios from "axios";
import "../styles/warehouseDashboard.css";

class WarehouseDashboard extends Component {
  state = {
    role: "",
    name: "",
    warehouse: "",
  };

  async componentDidMount() {
    try {
      let tokenAccess = localStorage.getItem("TA");
      let res = await axios.get(
        `${API_URL}/admin-warehouse-transaction/data-admin`,
        {
          headers: {
            Authorization: "Bearer " + tokenAccess,
          },
        }
      );
      this.setState({
        role: res.data[0].role,
        name: res.data[0].name,
        warehouse: res.data[0].warehouse,
      });
    } catch (error) {
      console.log(error);
    }
  }

  onLogoutClick = () => {
    localStorage.removeItem("TA");
    localStorage.removeItem("TR");
    localStorage.removeItem("data");
    this.props.LogoutAction();
  };

  render() {
    const { role, name, warehouse } = this.state;
    return (
      <div className="whdashboard-container">
        <div className="whdashboard-sidebar">
          <div className="wh-sidebar-content">
            <div className="wh-sb-content-1">
              <h1 className="wh-sb-text-1">Fournir Warehouse</h1>
            </div>
            <div className="wh-sb-content-2">
              <Link
                to="/admin/dashboard"
                style={{
                  textDecoration: "none",
                  color: "#535353",
                }}
              >
                <ButtonBase
                  disableRipple
                  style={{
                    marginBottom: "27px",
                    fontSize: "14px",
                    color:
                      window.location.href ===
                      "http://localhost:3000/admin/dashboard"
                        ? "#535353"
                        : "#b4b4b4",
                    fontWeight: "bold",
                  }}
                >
                  <AssignmentIcon
                    style={{
                      marginRight: "20px",
                      color:
                        window.location.href ===
                        "http://localhost:3000/admin/dashboard"
                          ? "#535353"
                          : "#b4b4b4",
                    }}
                  />
                  Transactions
                </ButtonBase>
              </Link>

              {role == 2 ? null : (
                <React.Fragment>
                  <Link
                    to="/admin/dashboard/requeststock"
                    style={{
                      textDecoration: "none",
                      color: "#535353",
                    }}
                  >
                    <ButtonBase
                      disableRipple
                      style={{
                        marginBottom: "27px",
                        fontSize: "14px",
                        color:
                          window.location.href ===
                          "http://localhost:3000/admin/dashboard/requeststock"
                            ? "#535353"
                            : "#b4b4b4",
                        fontWeight: "bold",
                      }}
                    >
                      <DraftsIcon
                        style={{
                          marginRight: "20px",
                          color:
                            window.location.href ===
                            "http://localhost:3000/admin/dashboard/requeststock"
                              ? "#535353"
                              : "#b4b4b4",
                        }}
                      />
                      Requests
                    </ButtonBase>
                  </Link>

                  <Link
                    to="/admin/dashboard/processing"
                    style={{
                      textDecoration: "none",
                      color: "#535353",
                    }}
                  >
                    <ButtonBase
                      disableRipple
                      style={{
                        marginBottom: "27px",
                        fontSize: "14px",
                        color:
                          window.location.href ===
                          "http://localhost:3000/admin/dashboard/processing"
                            ? "#535353"
                            : "#b4b4b4",
                        fontWeight: "bold",
                      }}
                    >
                      <SettingsIcon
                        style={{
                          marginRight: "20px",
                          color:
                            window.location.href ===
                            "http://localhost:3000/admin/dashboard/processing"
                              ? "#535353"
                              : "#b4b4b4",
                        }}
                      />
                      Processing
                    </ButtonBase>
                  </Link>
                </React.Fragment>
              )}

              <div className="container-bottom-wh-ds">
                <Link to="/admin/login"
                  style={{
                    textDecoration: "none",
                    color: "#535353",
                  }}
                >
                  <ButtonBase
                    disableRipple
                    style={{
                      marginBottom: "27px",
                      fontSize: "15px",
                      color: "#535353",
                      fontWeight: "bold",
                    }}
                    onClick={this.onLogoutClick}
                  >
                    <ExitToAppIcon
                      style={{
                        marginRight: "20px",
                        color: "#535353",
                      }}
                    />
                    Logout
                  </ButtonBase>
                </Link>

                <div className="wh-sb-admin-information">
                  <AccountBoxIcon
                    style={{
                      marginRight: "20px",
                      color: "#535353",
                    }}
                  />
                  <div className="wh-sb-profile-admin">
                    <p className="wh-sb-admin-name">{name}</p>
                    <p className="wh-sb-admin-warehouse">
                      {role == 2 ? "Super Admin" : warehouse}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="whdashboard-content">
          <Switch>
            <Route path="/admin/dashboard" exact component={Transaction} />
            <Route
              path="/admin/dashboard/requeststock"
              exact
              component={RequestStock}
            />
            <Route
              path="/admin/dashboard/processing"
              exact
              component={Processing}
            />
          </Switch>
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
})(WarehouseDashboard);
