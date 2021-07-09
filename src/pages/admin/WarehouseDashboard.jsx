import React, { Component } from "react";
import { ButtonBase } from "@material-ui/core";
import { API_URL } from "../../helper";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { LogoutAction } from "../../redux/actions";
import { connect } from "react-redux";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DraftsIcon from "@material-ui/icons/Drafts";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import ListAltIcon from "@material-ui/icons/ListAlt";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import GroupIcon from "@material-ui/icons/Group";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import DataUsageIcon from "@material-ui/icons/DataUsage";
import Transaction from "./Transaction";
import Processing from "./Processing";
import RequestStock from "./RequestStock";
import ManageProduct from "./ManageProduct";
import Revenue from "./Home";
import Report from "./Report";
import CreateAdmin from "./CreateAdmin";
import ProductsFlow from "./ProductsFlow";
import axios from "axios";
import "../styles/warehouseDashboard.css";
class WarehouseDashboard extends Component {
  state = {
    role: "",
    name: "",
    warehouse: "",
  };

  async componentDidMount() {
    console.log(this.props.match.params.status);
    console.log(this.props.match);
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
    if (!this.props.dataUser.islogin) {
      return <Redirect to="/unauthorize" />;
    }
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
                to="/admin/dashboard/transaction"
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
                      this.props.match.params.status == "transaction"
                        ? "#535353"
                        : "#b4b4b4",
                    fontWeight: "bold",
                  }}
                >
                  <AssignmentIcon
                    style={{
                      marginRight: "20px",
                      color:
                        this.props.match.params.status == "transaction"
                          ? "#535353"
                          : "#b4b4b4",
                    }}
                  />
                  Transactions
                </ButtonBase>
              </Link>

              {role == 2 ? (
                <React.Fragment>
                  <Link
                    to="/admin/dashboard/report-admin"
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
                          this.props.match.params.status == "report-admin"
                            ? "#535353"
                            : "#b4b4b4",
                        fontWeight: "bold",
                      }}
                    >
                      <DataUsageIcon
                        style={{
                          marginRight: "20px",
                          color:
                            this.props.match.params.status == "report-admin"
                              ? "#535353"
                              : "#b4b4b4",
                        }}
                      />
                      Report
                    </ButtonBase>
                  </Link>
                  <Link
                    to="/admin/dashboard/add-admin"
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
                          this.props.match.params.status == "add-admin"
                            ? "#535353"
                            : "#b4b4b4",
                        fontWeight: "bold",
                      }}
                    >
                      <GroupIcon
                        style={{
                          marginRight: "20px",
                          color:
                            this.props.match.params.status == "add-admin"
                              ? "#535353"
                              : "#b4b4b4",
                        }}
                      />
                      Create Admin
                    </ButtonBase>
                  </Link>
                  <Link
                    to="/admin/dashboard/manage-product"
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
                          this.props.match.params.status == "manage-product"
                            ? "#535353"
                            : "#b4b4b4",
                        fontWeight: "bold",
                      }}
                    >
                      <ListAltIcon
                        style={{
                          marginRight: "20px",
                          color:
                            this.props.match.params.status == "manage-product"
                              ? "#535353"
                              : "#b4b4b4",
                        }}
                      />
                      Manage Product
                    </ButtonBase>
                  </Link>
                  <Link
                    to="/admin/dashboard/revenue"
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
                          this.props.match.params.status == "revenue"
                            ? "#535353"
                            : "#b4b4b4",
                        fontWeight: "bold",
                      }}
                    >
                      <EqualizerIcon
                        style={{
                          marginRight: "20px",
                          color:
                            this.props.match.params.status == "revenue"
                              ? "#535353"
                              : "#b4b4b4",
                        }}
                      />
                      Revenue
                    </ButtonBase>
                  </Link>
                </React.Fragment>
              ) : (
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
                          this.props.match.params.status == "requeststock"
                            ? "#535353"
                            : "#b4b4b4",
                        fontWeight: "bold",
                      }}
                    >
                      <DraftsIcon
                        style={{
                          marginRight: "20px",
                          color:
                            this.props.match.params.status == "requeststock"
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
                          this.props.match.params.status == "processing"
                            ? "#535353"
                            : "#b4b4b4",
                        fontWeight: "bold",
                      }}
                    >
                      <SettingsIcon
                        style={{
                          marginRight: "20px",
                          color:
                            this.props.match.params.status == "processing"
                              ? "#535353"
                              : "#b4b4b4",
                        }}
                      />
                      Processing
                    </ButtonBase>
                  </Link>

                  <Link
                    to="/admin/dashboard/products-flow"
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
                          this.props.match.params.status == "products-flow"
                            ? "#535353"
                            : "#b4b4b4",
                        fontWeight: "bold",
                      }}
                    >
                      <SwapHorizIcon
                        style={{
                          marginRight: "20px",
                          color:
                            this.props.match.params.status == "products-flow"
                              ? "#535353"
                              : "#b4b4b4",
                        }}
                      />
                      Products Flow
                    </ButtonBase>
                  </Link>
                </React.Fragment>
              )}

              <div
                className={
                  role == 2
                    ? "container-bottom-wh-ds-super"
                    : "container-bottom-wh-ds"
                }
              >
                <Link
                  to="/admin/login"
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
            <Route
              path="/admin/dashboard/transaction"
              exact
              component={Transaction}
            />
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
            <Route
              path="/admin/dashboard/manage-product"
              exact
              component={ManageProduct}
            />
            <Route path="/admin/dashboard/revenue" exact component={Revenue} />
            <Route
              path="/admin/dashboard/report-admin"
              exact
              component={Report}
            />
            <Route
              path="/admin/dashboard/add-admin"
              exact
              component={CreateAdmin}
            />
            <Route
              path="/admin/dashboard/products-flow"
              exact
              component={ProductsFlow}
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
