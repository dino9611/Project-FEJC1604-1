import React, { Component } from "react";
import Axios from "axios";
import { API_URL, currencyFormatter } from "../../helper";
import {
  Select,
  MenuItem,
  Button,
  DialogActions,
  InputBase,
  Dialog,
  DialogContent,
  Snackbar,
} from "@material-ui/core";
import Header from "../../components/Header";
import LoaderComp from "../../components/Loader";
import { withStyles } from "@material-ui/core/styles";
import { FiSearch } from "react-icons/fi";
import MuiAlert from "@material-ui/lab/Alert";
import ModalDP from "../../components/ModalDP";
import SyncIcon from "@material-ui/icons/Sync";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import CloseIcon from "@material-ui/icons/Close";
import Empty from "../../images/history-empty.svg";
import "./../styles/History.css";
import "./../../components/styles/ModalDP.css"; //buat style modal detail product

const useStyles = (theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
});

const upperCase = (string) => {
  return string[0].toUpperCase() + string.slice(1); // buat ngubah nama status jadi otomatis uppercase
};

class History extends Component {
  state = {
    history: [],
    row: [],
    dropdown: false,
    idProd: 0,
    modalDetail: false,
    details: [],
    invoice: [],
    status: [],
    date: [],
    hour: [],
    statusTransaction: [],
    loading: false,
    openDialogAcceptedOrder: false,
    openSnack: false,
    searchInput: "",
  };

  componentDidMount() {
    let tokenAccess = localStorage.getItem("TA");
    this.setState({ loading: true });
    Axios.get(`${API_URL}/transaction/history`, {
      headers: {
        Authorization: "Bearer " + tokenAccess,
      },
    })
      .then((res) => {
        this.setState({ history: res.data, loading: false });
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate(prevprops, prevstate) {
    if (
      (this.state.idProd !== prevstate.idProd && this.state.idProd != 0) ||
      this.state.statusTransaction != prevstate.statusTransaction ||
      this.state.openDialogAcceptedOrder != prevstate.openDialogAcceptedOrder ||
      this.state.searchInput !== prevstate.searchInput
    ) {
      let tokenAccess = localStorage.getItem("TA");
      Axios.get(`${API_URL}/transaction/detailHistory/${this.state.idProd}`)
        .then((res) => {
          Axios.get(`${API_URL}/transaction/history`, {
            headers: {
              Authorization: "Bearer " + tokenAccess,
            },
            params: {
              status:
                this.state.statusTransaction === "All"
                  ? ""
                  : this.state.statusTransaction,
              search: this.state.searchInput,
            },
          })
            .then((res1) => {
              this.setState({
                details: res.data,
                invoice: res.data.map((val) => val.invoice),
                status: res.data.map((val) => val.status),
                date: res.data.map((val) => val.date),
                hour: res.data.map((val) => val.hour_),
                history: res1.data,
                loading: false,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleChange = (e) => {
    this.setState({ statusTransaction: e.target.value });
  };

  searchChange = (e) => {
    this.setState({ searchInput: e.target.value });
  };

  detailProduct = (index) => {
    let idProd = this.state.idProd;
    let data = this.state.history[index];
    idProd = data.id;
    this.setState({ idProd: idProd, modalDetail: true });
  };

  dialogAccepted = (val) => {
    this.setState({ openDialogAcceptedOrder: true, row: val });
  };

  onAcceptClick = () => {
    let tokenAccess = localStorage.getItem("TA");
    Axios.put(
      `${API_URL}/transaction/accepted-order`,
      {
        status: "delivered",
        row: this.state.row,
      },
      {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
      }
    )
      .then((res) => {
        this.setState({ openSnack: true, openDialogAcceptedOrder: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderAcceptItem = (val) => {
    return (
      <div className="delivered-order" onClick={() => this.dialogAccepted(val)}>
        <div className="accepted-order">
          Have you received the product? and are there no complaints about it?
          click to confirmation
        </div>
      </div>
    );
  };

  renderHistory = () => {
    return this.state.history.map((val, index) => {
      return (
        <React.Fragment>
          <div className="history-list" key={val.id}>
            <div className="history-upper">
              <div
                className="history-status"
                style={{
                  backgroundColor: val.status == "rejected" ? "#da003773" : "",
                }}
              >
                {val.status == "processed" ? (
                  <span>
                    <SyncIcon /> {val.status}
                  </span>
                ) : val.status == "sending" ? (
                  <span>
                    <LocalShippingIcon /> {val.status}
                  </span>
                ) : val.status == "rejected" ? (
                  <span style={{ color: "#da0037" }}>
                    <CloseIcon /> {val.status}
                  </span>
                ) : (
                  val.status
                )}
              </div>
              <div className="history-date" width="120px">
                {val.date}
              </div>
            </div>
            <div className="history-bottom">
              <div className="history-bottom-left">
                <div className="history-img">
                  <img src={API_URL + val.image} alt={val.name} />
                </div>
                <div className="history-nameprice">
                  <div className="history-name" width="200px">
                    {val.name}
                  </div>
                  <div className="history-price" width="180px">
                    {val.qty} items x{" "}
                    {currencyFormatter(val.price).split(",")[0]}
                  </div>
                </div>
              </div>
              <div className="history-bottom-right">
                <div className="history-divider" width="100px"></div>
                <div className="history-totalprice">
                  <div>Total price</div>
                  <div className="totalprice">
                    {currencyFormatter(val.total_price).split(",")[0]}
                  </div>
                </div>
              </div>
            </div>
            <div className="history-button-group">
              <div
                className="history-button-detail"
                onClick={() => this.detailProduct(index)}
              >
                Transaction Detail
              </div>
              <div className="history-button-sending">
                {val.status == "sending" ? this.renderAcceptItem(val) : null}
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  renderDetail = () => {
    return this.state.details.map((val, index) => {
      return (
        <div className="modal-dp-render-content" key={index}>
          <div className="modal-dp-render-dataprod" style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100px",
                height: "100px",
                backgroundColor: "whitesmoke",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <img src={API_URL + val.image} alt={val.name} />
            </div>
            <div className="modal-dp-sm-prod">
              <p>{val.name}</p>
              <p>
                {val.qty} product x {currencyFormatter(val.price).split(",")[0]}
              </p>
            </div>
            <div
              style={{
                width: "1px",
                backgroundColor: "#e8e8e8",
                marginLeft: "100px",
              }}
            ></div>
            <div className="modal-dp-sm-price">
              <p>Price</p>
              <p>{currencyFormatter(val.price * val.qty).split(",")[0]}</p>
            </div>
          </div>
        </div>
      );
    });
  };

  onCloseClick = () => {
    this.setState({ modalDetail: false });
  };

  handleDialogAccepted = () => {
    this.setState({ openDialogAcceptedOrder: false });
  };

  handleSnack = () => {
    this.setState({ openSnack: false });
  };

  render() {
    const BootstrapInput = withStyles(() => ({
      input: {
        position: "relative",
        backgroundColor: "none",
        border: "none",
        width: "200px",
        fontSize: "1rem",
        color: "#e8e8e8",
        background: "none",
      },
    }))(InputBase);

    const { classes } = this.props;

    const Alert = (props) => {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
    };

    const { openDialogAcceptedOrder, openSnack } = this.state;

    return (
      <div>
        {
          <div>
            <Dialog
              open={openDialogAcceptedOrder}
              onClose={this.handleDialogAccepted}
              aria-labelledby="form-dialog-title"
            >
              <DialogContent>Do you want to accept this orders?</DialogContent>
              <DialogActions>
                <Button
                  onClick={this.onAcceptClick}
                  style={{ color: "#4aa96c" }}
                >
                  Accept
                </Button>
                <Button onClick={this.handleDialogAccepted}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </div>
        }
        {
          <div className={classes.root}>
            <Snackbar
              open={openSnack}
              autoHideDuration={10000}
              onClose={this.handleSnack}
            >
              <Alert onClose={this.handleSnack} severity="success">
                Your order is done!
              </Alert>
            </Snackbar>
          </div>
        }
        <Header />
        {this.state.loading ? <LoaderComp /> : null}
        <div className="jumbotron-1-history">
          <ModalDP
            closeDP={this.onCloseClick}
            openDP={this.state.modalDetail}
            invoiceDP={this.state.invoice[0]}
            statusDP={this.state.status[0]}
            dateDP={this.state.date[0]}
            hourDP={this.state.hour[0]}
            renderDP={this.renderDetail()}
          />
          <div className="history-content">
            <div className="history-filter">
              <div className="history-searchbar">
                <input
                  className="history-searchinput"
                  type="text"
                  placeholder="Search product..."
                  value={this.state.searchInput}
                  onChange={this.searchChange}
                />
                <FiSearch className="history-searchicon" />
              </div>
              <div className="history-dropdown">
                <Select
                  input={<BootstrapInput />}
                  value={this.state.statusTransaction}
                  onChange={this.handleChange}
                  displayEmpty
                  className="history-select-status"
                >
                  <MenuItem value="" disabled>
                    Show status
                  </MenuItem>
                  <MenuItem value="All">
                    <span>All</span>
                  </MenuItem>
                  <MenuItem value="awaiting payment">
                    <span>Awaiting Payment</span>
                  </MenuItem>
                  <MenuItem value="awaiting confirmation">
                    <span>Awaiting Confirmation</span>
                  </MenuItem>
                  <MenuItem value="processed">
                    <span>Processed</span>
                  </MenuItem>
                  <MenuItem value="sending">
                    <span>Sending</span>
                  </MenuItem>
                  <MenuItem value="delivered">
                    <span>Delivered</span>
                  </MenuItem>
                </Select>
              </div>
            </div>
            <div className="history-container-2">
              {!this.state.history.length ? (
                <div className="history-empty-list">
                  <img src={Empty} alt="" />
                  <div className="history-empty-text">
                    <p>No Results Found</p>
                    {this.state.searchInput ? (
                      <p>
                        We couldn't find a match for "{this.state.searchInput}".
                        Please try another search.
                      </p>
                    ) : (
                      <p>
                        We couldn't find a match for this status. Please try
                        another search.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                this.renderHistory()
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// {this.renderHistory()}
export default withStyles(useStyles)(History);
