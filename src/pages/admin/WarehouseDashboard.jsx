import React, { Component } from "react";
import { ButtonBase } from "@material-ui/core";
import { API_URL } from "../../helper";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DraftsIcon from "@material-ui/icons/Drafts";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import SettingsIcon from '@material-ui/icons/Settings';
import Transaction from "./Transaction";
import Processing from "./Processing";
import axios from "axios";
import "../styles/warehouseDashboard.css";

class WarehouseDashboard extends Component {
  state = {
    transactionComp: true,
    requestComp: false,
    processingComp: false,
    role: "",
    name: "",
    warehouse: "",
  };

  async componentDidMount() {
    try {
      let tokenAccess = localStorage.getItem("TA");
      let res = await axios.get(`${API_URL}/admin/data-admin`, {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
      });
      this.setState({
        role: res.data[0].role,
        name: res.data[0].name,
        warehouse: res.data[0].warehouse,
      });
    } catch (error) {
      console.log(error);
    }
  }

  toggleTransaction = () => {
    this.setState({
      transactionComp: true,
      requestComp: false,
      processingComp: false,
    });
  };

  toggleRequest = () => {
    this.setState({
      requestComp: true,
      transactionComp: false,
      processingComp: false,
    });
  };

  toggleProcessing = () => {
    this.setState({
      processingComp: true,
      transactionComp: false,
      requestComp: false,
    });
  };

  render() {
    const {
      transactionComp,
      requestComp,
      processingComp,
      role,
      name,
      warehouse,
    } = this.state;

    return (
      <div className="whdashboard-container">
        <div className="whdashboard-sidebar">
          <div className="wh-sidebar-content">
            <div className="wh-sb-content-1">
              <h1 className="wh-sb-text-1">Fournir Warehouse</h1>
            </div>
            <div className="wh-sb-content-2">
              <ButtonBase
                disableRipple
                style={{
                  marginBottom: "27px",
                  fontSize: "14px",
                  color: transactionComp ? "#535353" : "#b4b4b4",
                  fontWeight: "bold",
                }}
                onClick={this.toggleTransaction}
              >
                <AssignmentIcon
                  style={{
                    marginRight: "20px",
                    color: transactionComp ? "#535353" : "#b4b4b4",
                  }}
                />
                Transactions
              </ButtonBase>

              {role == 2 ? null : (
                <>
                  <ButtonBase
                    disableRipple
                    style={{
                      marginBottom: "27px",
                      fontSize: "14px",
                      color: requestComp ? "#535353" : "#b4b4b4",
                      fontWeight: "bold",
                    }}
                    onClick={this.toggleRequest}
                  >
                    <DraftsIcon
                      style={{
                        marginRight: "20px",
                        color: requestComp ? "#535353" : "#b4b4b4",
                      }}
                    />
                    Requests
                  </ButtonBase>
                  <ButtonBase
                    disableRipple
                    style={{
                      marginBottom: "27px",
                      fontSize: "14px",
                      color: processingComp ? "#535353" : "#b4b4b4",
                      fontWeight: "bold",
                    }}
                    onClick={this.toggleProcessing}
                  >
                    <SettingsIcon
                      style={{
                        marginRight: "20px",
                        color: processingComp ? "#535353" : "#b4b4b4",
                      }}
                    />
                    Processing
                  </ButtonBase>
                </>
              )}

              <div className="wh-sb-admin-information">
                <AccountBoxIcon
                  style={{
                    marginRight: "20px",
                    color: "#b4b4b4",
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
        <div className="whdashboard-content">
          {transactionComp ? <Transaction /> : null}
          {requestComp ? <h1>request comp</h1> : null}
          {processingComp ? <Processing /> : null}
        </div>
      </div>
    );
  }
}

export default WarehouseDashboard;
