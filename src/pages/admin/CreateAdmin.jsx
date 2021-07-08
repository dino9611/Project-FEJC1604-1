import React, { Component } from "react";
import Axios from "axios";
import { API_URL } from "./../../helper";
import { withStyles } from "@material-ui/core/styles";
import { Select, MenuItem, InputBase } from "@material-ui/core";
import ModalAA from "./../../components/ModalAA";
import AlertAdmin from "../../components/AlertAdmin";
import "./../styles/CreateAdmin.css";

class CreateAdmin extends Component {
  state = {
    dataUser: [],
    dataRole: [],
    detailModal: [],
    role: null,
    openSnack: false,
    totalData: 0,
    modalUpdate: false,
    loading: false,
    message: "",
    alertStatus: "",
  };

  componentDidMount() {
    this.setState({ loading: true });
    let tokenAccess = localStorage.getItem("TA");
    Axios.get(`${API_URL}/superAd/newAdminWarehouse`, {
      headers: { Authorization: "Bearer " + tokenAccess },
    })
      .then((res) => {
        this.setState({
          dataUser: res.data.dataUser,
          dataRole: res.data.dataRole,
          loading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onUpdateClick = (index) => {
    let detailModal = this.state.detailModal;
    let data = this.state.dataUser[index];
    detailModal.push(data);
    // console.log(this.state.detailModal, "56");
    this.setState({ detailModal: detailModal, modalUpdate: true });
  };

  onAddClick = () => {
    const name = this.state.detailModal[0].name_;
    const id = this.state.detailModal[0].id;
    const role = this.state.role;
    let data = { id: id, role: role };
    let tokenAccess = localStorage.getItem("TA");
    if (role > 2) {
      Axios.patch(`${API_URL}/superAd/newAdminWarehouse`, data, {
        headers: { Authorization: "Bearer " + tokenAccess },
      })
        .then((res) => {
          Axios.get(`${API_URL}/superAd/newAdminWarehouse`, {
            headers: { Authorization: "Bearer " + tokenAccess },
          })
            .then((res1) => {
              this.setState({
                message: `${name} is an admin now!`,
                alertStatus: "success",
                dataUser: res1.data.dataUser,
                dataRole: res1.data.dataRole,
                detailModal: [],
                role: null,
                modalUpdate: false,
                loading: false,
                openSnack: true,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
      this.setState({ message: "", openSnack: false, alertStatus: "" });
    } else {
      this.setState({
        message: "Choose the role first to update!",
        openSnack: true,
        alertStatus: "error",
      });
    }
  };

  roleChange = (e) => {
    this.setState({ role: e.target.value });
  };

  renderRole = () => {
    return this.state.dataRole.map((val, index) => {
      return (
        <MenuItem
          style={{ textTransform: "capitalize" }}
          key={index}
          value={val.id}
        >
          <span>{val.role.replace(/_/g, " ")}</span>
        </MenuItem>
      );
    });
  };

  renderUser = () => {
    return this.state.dataUser.map((val, index) => {
      return (
        <div className="cread-render-data" key={index}>
          <div className="cread-prod-img">
            <div>
              <img width="100%" src={API_URL + val.photo} />
            </div>
            <div className="cread-prod-name">{val.name_}</div>
          </div>
          <div>
            <div className="cread-prod-email">{val.email}</div>
          </div>
          <div>
            <div className="cread-prod-phone">{val.phone_number}</div>
          </div>
          <div>
            <div className="cread-prod-gender">{val.gender}</div>
          </div>
          <div>
            <button
              onClick={() => this.onUpdateClick(index)}
              className="cread-prod-action"
            >
              change role
            </button>
          </div>
        </div>
      );
    });
  };

  renderModal = () => {
    const BootstrapInput = withStyles(() => ({
      input: {
        position: "relative",
        backgroundColor: "none",
        border: "none",
        width: "250px",
        fontSize: "1rem",
        color: "gainsboro",
        background: "none",
      },
    }))(InputBase);
    if (this.state.detailModal.length > 0) {
      return this.state.detailModal.map((val) => {
        return (
          <React.Fragment key={val.id}>
            <div className="modal-aa-inside">
              <div className="modal-aa-img">
                <img src={API_URL + val.photo} alt="" />
              </div>
              <div className="modal-aa-name">
                <div>Choose role</div>
                <div>
                  <Select
                    value={this.state.role}
                    onChange={this.roleChange}
                    input={<BootstrapInput />}
                    displayEmpty
                    className="profo-select-status"
                  >
                    <MenuItem value="" disabled>
                      Role
                    </MenuItem>
                    {this.renderRole()}
                  </Select>
                </div>
              </div>
            </div>
            <div className="modal-aa-bottom">
              <div className="modal-aa-button">
                <button
                  onClick={() =>
                    this.setState({
                      modalUpdate: false,
                      detailModal: [],
                      role: null,
                    })
                  }
                >
                  Cancel
                </button>
                <button onClick={this.onAddClick}>Change</button>
              </div>
            </div>
          </React.Fragment>
        );
      });
    } else {
      return null;
    }
  };

  onCloseClick = () => {
    this.setState({ modalUpdate: false, detailModal: [], role: null });
  };

  handleSnack = () => {
    this.setState({ openSnack: false, message: "", alertStatus: "" });
  };

  render() {
    return (
      <div className="jumbotron-1-cread">
        <ModalAA
          renderUser={this.renderModal()}
          openAA={this.state.modalUpdate}
          closeAA={this.onCloseClick}
          name={this.state.detailModal.map((val) => val.name_)}
        />
        <div className="sidebar-cread"> untuk side bar</div>
        <div className="cread-content">
          <div className="cread-title-content">
            <p>Super Admin</p>
          </div>
          <div className="cread-content-in">
            <div className="cread-search-content">
              <div className="cread-search-in">
                <div>User Management</div>
              </div>
            </div>
            <div className="cread-th">
              <div className="cread-t1">
                <div>Name</div>
              </div>
              <div className="cread-t2">
                <div>Email</div>
              </div>
              <div className="cread-t3">
                <div>Phone</div>
              </div>
              <div className="cread-t4">
                <div>Gender</div>
              </div>
              <div className="cread-t5">
                <div>Action</div>
              </div>
            </div>
            <div>{this.renderUser()}</div>
          </div>
        </div>
        <AlertAdmin
          openSnack={this.state.openSnack}
          handleSnack={this.handleSnack}
          message={this.state.message}
          status={this.state.alertStatus}
        />
      </div>
    );
  }
}

export default CreateAdmin;
