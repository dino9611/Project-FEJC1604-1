import React, { Component } from "react";
import Axios from "axios";
import { API_URL, currencyFormatter } from "../../helper";
import Header from "../../components/Header";
import { withStyles } from "@material-ui/core/styles";
import { Select, MenuItem, InputBase } from "@material-ui/core";
import { FiSearch } from "react-icons/fi";
import ModalDP from "../../components/ModalDP";
import "./../styles/History.css";
import "./../../components/styles/ModalDP.css"; //buat style modal detail product

class History extends Component {
  state = {
    history: [],
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
  };

  componentDidMount() {
    let tokenAccess = localStorage.getItem("TA");
    Axios.get(`${API_URL}/transaction/history`, {
      headers: {
        Authorization: "Bearer " + tokenAccess,
      },
    })
      .then((res) => {
        this.setState({ history: res.data });
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate(prevprops, prevstate) {
    if (
      (this.state.idProd !== prevstate.idProd && this.state.idProd != 0) ||
      this.state.statusTransaction != prevstate.statusTransaction
    ) {
      this.setState({ loading: true });
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

  detailProduct = (index) => {
    let idProd = this.state.idProd;
    let data = this.state.history[index];
    idProd = data.id;
    this.setState({ idProd: idProd, modalDetail: true });
  };

  renderHistory = () => {
    return this.state.history.map((val, index) => {
      return (
        <div className="history-list" key={val.id}>
          <div className="history-upper">
            <div className="history-status">{val.status}</div>
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
                  {val.qty} items x {currencyFormatter(val.price)}
                </div>
              </div>
            </div>
            <div className="history-bottom-right">
              <div className="history-divider" width="100px"></div>
              <div className="history-totalprice">
                <div>Total price</div>
                <div>{currencyFormatter(val.total_price)}</div>
              </div>
            </div>
          </div>
          <div className="history-button-content">
            <div
              className="history-button-detail"
              onClick={() => this.detailProduct(index)}
            >
              Transaction Detail
            </div>
          </div>
        </div>
      );
    });
  };

  renderDetail = () => {
    return this.state.details.map((val, index) => {
      return (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            marginBottom: "5px",
            marginTop: "5px",
          }}
          key={index}
        >
          <div style={{ display: "flex" }}>
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
                {val.qty} product x {currencyFormatter(val.price)}
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
              <p>{currencyFormatter(val.price * val.qty)}</p>
            </div>
          </div>
        </div>
      );
    });
  };

  onCloseClick = () => {
    this.setState({ modalDetail: false });
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

    return (
      <div>
        <Header />
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
                </Select>
              </div>
            </div>
            <div>{this.renderHistory()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default History;
