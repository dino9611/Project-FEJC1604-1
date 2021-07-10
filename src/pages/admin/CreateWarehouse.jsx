import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  ButtonBase,
  Snackbar
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { API_URL } from "../../helper";
import axios from "axios";
import "../styles/createWarehouse.css";

const useStyles = (theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
});

class CreateWarehouse extends Component {
  state = {
    warehouse: [],
    openDialog: false,
    openSnack: false,
    location: "",
    latitude: "",
    longitude: "",
    message: ""
  };

  async componentDidMount() {
    try {
      let tokenAccess = localStorage.getItem("TA");
      let getDataWarehouse = await axios.get(`${API_URL}/admin/get-warehouse`, {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
      });
      this.setState({
        warehouse: getDataWarehouse.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if(prevState.openDialog != this.state.openDialog){
      let tokenAccess = localStorage.getItem("TA");
      let getDataWarehouse = await axios.get(`${API_URL}/admin/get-warehouse`, {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
      });
      this.setState({
        warehouse: getDataWarehouse.data,
      });
    }
  }

  onCreateWarehouseClick = () => {
    let tokenAccess = localStorage.getItem("TA");
    axios
      .post(
        `${API_URL}/admin/add-warehouse`,
        {
          location: this.state.location,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          warehouse: this.state.warehouse
        },
        {
          headers: {
            Authorization: "Bearer " + tokenAccess,
          },
        }
      )
      .then((res) => {
        console.log(res.data)
        this.setState({ message: res.data.message });
        if(this.state.message == "Warehouse added successfully"){
          this.setState({openDialog: false, openSnack: true})
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  renderModal = () => {
    if (this.state.openDialog) {
      return (
        <div
          style={{
            paddingTop: 20,
            paddingRight: 40,
            paddingBottom: 20,
            paddingLeft: 40,
            width: "500px"
          }}
        >
          <DialogTitle id="form-dialog-title">Create new warehouse</DialogTitle>
          <DialogContent>
            <div
              style={{
                paddingTop: 15,
                paddingBottom: 15,
              }}
            >
              {this.state.message ? (
                <Alert severity={this.state.message == "Warehouse already exists" ? "error" : "info"} style={{ marginBottom: "10px" }}>
                  {this.state.message}
                </Alert>
              ) : null}
              <div style={{ marginBottom: "10px" }}>
                <p style={{ marginBottom: "1px" }}>Warehouse location.</p>
                <InputBase
                  type="text"
                  value={this.state.location}
                  placeholder="Location"
                  className="form-control"
                  name="location"
                  onChange={this.onChange}
                  style={{
                    width: "100%",
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <p style={{ marginBottom: "1px" }}>Latitude location.</p>
                <InputBase
                  type="text"
                  value={this.state.latitude}
                  placeholder="Latitude"
                  className="form-control"
                  name="latitude"
                  onChange={this.onChange}
                  style={{
                    width: "100%",
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <p style={{ marginBottom: "1px" }}>Longitude location.</p>
                <InputBase
                  type="text"
                  value={this.state.longitude}
                  placeholder="Longitude"
                  className="form-control"
                  name="longitude"
                  onChange={this.onChange}
                  style={{
                    width: "100%",
                  }}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Cancel</Button>
            <Button
              onClick={this.onCreateWarehouseClick}
              style={{ color: "#4aa96c" }}
            >
              Create
            </Button>
          </DialogActions>
        </div>
      );
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleClose = () => {
    this.setState({ openDialog: false });
  };

  handleSnack = () => {
    this.setState({ openSnack: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        {
          <div>
            <Dialog
              open={this.state.openDialog}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              {this.renderModal()}
            </Dialog>
          </div>
        }
        {
          <div className={classes.root}>
            <Snackbar
              open={this.state.openSnack}
              autoHideDuration={10000}
              onClose={this.handleSnack}
            >
              <Alert onClose={this.handleSnack} severity="success">
                {this.state.message}
              </Alert>
            </Snackbar>
          </div>
        }
        <div className="transaction-container">
          <div className="transaction-content">
            <div className="transaction-content-left">
              <p className="transaction-text-1">Add Warehouse</p>
            </div>
          </div>
          <div className="create-wh-content">
            <div className="list-warehouse">
              <div className="text-content-2">Location</div>
              <div className="text-content">Latitude</div>
              <div className="text-content">Longitude</div>
              <div className="text-content">Total Order</div>
              <div className="text-content">Total Admin</div>
            </div>
            <div>
              {this.state.warehouse.map((val) => {
                return (
                  <div className="content-warehouse">
                    <div className="text-content-2">{val.location}</div>
                    <div className="text-content">{val.latitude}</div>
                    <div className="text-content">{val.longitude}</div>
                    <div className="text-content">{val.totalOrders}</div>
                    <div className="text-content">{val.totalAdmin}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <ButtonBase
              disableRipple
              style={{
                width: "13%",
                backgroundColor: "#4aa96c",
                color: "white",
                borderRadius: 0,
                padding: 7,
                marginTop: 34,
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: 0.3,
              }}
              onClick={() => this.setState({ openDialog: true })}
            >
              Add Warehouse
            </ButtonBase>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(CreateWarehouse);