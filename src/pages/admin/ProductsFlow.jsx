import React, { Component } from "react";
import Axios from "axios";
import { API_URL, currencyFormatter } from "../../helper";
import { withStyles } from "@material-ui/core/styles";
import { Select, MenuItem, InputBase } from "@material-ui/core";
import Empty from "./../../images/pf-empty.svg";
import "./../styles/ProductsFlow.css";

class ProductsFlow extends Component {
  state = {
    dataProd: [],
    status: [],
    location: [],
    loading: false,
  };

  componentDidMount() {
    let tokenAccess = localStorage.getItem("TA");
    Axios.get(`${API_URL}/adminProd/goingInOut`, {
      headers: { Authorization: "Bearer " + tokenAccess },
    })
      .then((res) => {
        this.setState({
          dataProd: res.data,
          location: res.data[0].location,
        });
        console.log(this.state.dataProd);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate(prevprops, prevstate) {
    if (this.state.status !== prevstate.status) {
      this.setState({ loading: true });
      let tokenAccess = localStorage.getItem("TA");
      Axios.get(`${API_URL}/adminProd/goingInOut`, {
        headers: { Authorization: "Bearer " + tokenAccess },
        params: {
          status: this.state.status === "All" ? "" : this.state.status,
        },
      })
        .then((res) => {
          this.setState({
            dataProd: res.data,
          });
          console.log(this.state.dataProd);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  renderData = () => {
    return this.state.dataProd.map((val, index) => {
      return (
        <div className="profo-render-data" key={index}>
          <div className="profo-prod-img">
            <img width="100%" src={API_URL + val.image} alt="" />
          </div>
          <div className="profo-render-in" style={{ flex: 1 }}>
            <div className="profo-prod-name">
              <div>{val.name}</div>
              <div>{val.category_name}</div>
            </div>
          </div>
          <div className="profo-render-in" style={{ flex: 1 }}>
            <div className="profo-prod-price">
              {currencyFormatter(val.price)}
            </div>
          </div>
          <div className="profo-render-in" style={{ flex: 0.5 }}>
            <div className="profo-prod-qty">{val.qty}</div>
          </div>
          <div className="profo-render-in" style={{ flex: 1 }}>
            <div className="profo-prod-date">
              {val.date}, {val.hour_} WIB
            </div>
          </div>
          <div className="profo-render-in" style={{ flex: 1 }}>
            <div
              className="profo-prod-status"
              style={{
                color: val.status == "in" ? "green" : "red",
                backgroundColor: val.status == "in" ? "honeydew" : "#FFF0F0",
              }}
            >
              {val.status.toUpperCase()}
            </div>
          </div>
        </div>
      );
    });
  };

  statusChange = (e) => {
    this.setState({ status: e.target.value });
  };

  render() {
    const BootstrapInput = withStyles(() => ({
      input: {
        position: "relative",
        backgroundColor: "none",
        border: "none",
        width: "150px",
        fontSize: "1rem",
        color: "gainsboro",
        background: "none",
      },
    }))(InputBase);

    return (
      <div className="jumbotron-1-profo">
        <div className="sidebar-profo"> untuk side bar</div>
        <div className="profo-content">
          <div className="profo-title-content">
            <p>Products Flow</p>
          </div>
          <div className="profo-content-in">
            <div className="profo-search-content">
              <div className="profo-search-in">
                <div>Warehouse {this.state.location}</div>
                <div className="profo-search-right">
                  <div>Status :</div>
                  <div>
                    <Select
                      value={this.state.status}
                      onChange={this.statusChange}
                      input={<BootstrapInput />}
                      displayEmpty
                      className="profo-select-status"
                    >
                      <MenuItem value="" disabled>
                        Status
                      </MenuItem>
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="out">Out</MenuItem>
                      <MenuItem value="in">In</MenuItem>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="profo-th">
              <div className="profo-t1">
                <div>Image</div>
              </div>
              <div className="profo-t2">
                <div>Name</div>
              </div>
              <div className="profo-t3">
                <div>Price</div>
              </div>
              <div className="profo-t4">
                <div>Qty</div>
              </div>
              <div className="profo-t5">
                <div>Date</div>
              </div>
              <div className="profo-t6">
                <div>Status</div>
              </div>
            </div>
            <div>
              {!this.state.dataProd.length ? (
                <div className="profo-empty-result">
                  <img src={Empty} alt="" />
                  <div className="profo-warning">
                    <p>No Results Found.</p>
                    <p>
                      We couldn't find a match for this status. Please try
                      another.
                    </p>
                  </div>
                </div>
              ) : (
                this.renderData()
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductsFlow;
