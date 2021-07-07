import React, { Component } from "react";
import { API_URL, currencyFormatter } from "./../../helper";
import TablePagination from "@material-ui/core/TablePagination";
import Empty from "./../../images/pf-empty.svg";
import { FaLongArrowAltRight } from "react-icons/fa";
import ModalPW from "../../components/ModalPW";
import Axios from "axios";
import "./../styles/ProductWarehouse.css";
import "./../../components/styles/ModalPW.css";

class ProductWarehouse extends Component {
  state = {
    dataProd: [],
    detailProd: [],
    totalData: 0,
    idProd: 0,
    modalUpdate: false,
    loading: false,
    page: 0,
    limit: 10,
    qty: 0,
  };

  componentDidMount() {
    this.setState({ loading: true });
    let tokenAccess = localStorage.getItem("TA");
    Axios.get(`${API_URL}/adminProd/productsWarehouse`, {
      headers: { Authorization: "Bearer " + tokenAccess },
      params: {
        pages: this.state.page,
        limit: this.state.limit,
      },
    })
      .then((res) => {
        this.setState({
          dataProd: res.data.dataProducts,
          totalData: res.data.totalData,
          loading: false,
        });
        console.log(this.state.totalData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate(prevprops, prevstate) {
    if (
      this.state.page !== prevstate.page ||
      this.state.limit !== prevstate.limit
    ) {
      this.setState({ loading: true });
      let tokenAccess = localStorage.getItem("TA");
      Axios.get(`${API_URL}/adminProd/productsWarehouse`, {
        headers: { Authorization: "Bearer " + tokenAccess },
        params: {
          pages: this.state.page,
          limit: this.state.limit,
        },
      })
        .then((res) => {
          this.setState({
            dataProd: res.data.dataProducts,
            totalData: res.data.totalData,
            loading: false,
          });
          console.log(this.state.totalData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleChangePage = (e, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  handleChangeLimit = (e) => {
    this.setState({
      limit: e.target.value,
      page: 0,
    });
  };

  onChangeQty = (e) => {
    let qty = this.state.qty;
    qty = e.target.value;
    this.setState({ qty: qty });
  };

  onUpdateClick = (index) => {
    let detailProd = this.state.detailProd;
    let data = this.state.dataProd[index];
    detailProd.push(data);
    console.log(this.state.detailProd, "56");
    this.setState({ detailProd: detailProd, modalUpdate: true });
  };

  onUpdateAdd = () => {
    const qty = parseInt(this.state.qty);
    const id = this.state.detailProd[0].id;
    let data = { products_id: id, qty: qty };
    let tokenAccess = localStorage.getItem("TA");
    if (qty > -1) {
      Axios.post(`${API_URL}/adminProd/updateStockWarehouse`, data, {
        headers: { Authorization: "Bearer " + tokenAccess },
      })
        .then(() => {
          Axios.get(`${API_URL}/adminProd/productsWarehouse`, {
            headers: { Authorization: "Bearer " + tokenAccess },
            params: {
              pages: this.state.page,
              limit: this.state.limit,
            },
          })
            .then((res1) => {
              this.setState({
                qty: 0,
                modalUpdate: false,
                detailProd: [],
                dataProd: res1.data.dataProducts,
                totalData: res1.data.totalData,
                loading: false,
              });
              console.log(this.state.totalData);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("data harus diinput");
    }
  };

  renderData = () => {
    return this.state.dataProd.map((val, index) => {
      return (
        <div className="prowa-render-data" key={index}>
          <div className="prowa-prod-img">
            <img width="100%" src={API_URL + val.image} alt="" />
          </div>
          <div className="prowa-render-in" style={{ flex: 1 }}>
            <div className="prowa-prod-name">
              <div>{val.name}</div>
              <div>{val.category_name}</div>
            </div>
          </div>
          <div className="prowa-render-in" style={{ flex: 1 }}>
            <div className="prowa-prod-price">
              {currencyFormatter(val.price)}
            </div>
          </div>
          <div className="prowa-render-in" style={{ flex: 0.5 }}>
            <div
              className="prowa-prod-qty"
              style={{ color: val.stock === 0 ? "red" : "black" }}
            >
              {val.stock}
            </div>
          </div>
          <div className="prowa-render-in" style={{ flex: 1 }}>
            <div className="prowa-prod-date">{val.month_}</div>
          </div>
          <div className="prowa-render-in" style={{ flex: 1 }}>
            <button
              className="prowa-prod-action"
              onClick={() => this.onUpdateClick(index)}
            >
              Update Stock
            </button>
          </div>
        </div>
      );
    });
  };

  renderDetail = () => {
    if (this.state.detailProd.length > 0) {
      return this.state.detailProd.map((val) => {
        return (
          <React.Fragment key={val.id}>
            <div className="modal-pw-inside">
              <div className="modal-pw-img">
                <img src={API_URL + val.image} alt="" />
              </div>
              <div className="modal-pw-name">
                <div>{val.name}</div>
                <div className="modal-pw-cat">{val.category_name}</div>
                <div className="modal-pw-price">
                  {currencyFormatter(val.price)}
                </div>
              </div>
            </div>
            <div className="modal-pw-bottom">
              <div className="modal-pw-input">
                <div>
                  <div>CURRENT STOCK</div>
                  <input type="number" placeholder={val.stock} disabled />
                </div>
                <div className="modal-pw-icon">
                  <FaLongArrowAltRight
                    style={{ fontSize: "1.5rem", color: "grey" }}
                  />
                </div>
                <div>
                  <div>UPDATE TO</div>
                  <input
                    type="number"
                    value={this.state.qty}
                    onChange={this.onChangeQty}
                  />
                </div>
              </div>
              <hr />
              <div className="modal-pw-button">
                <button
                  onClick={() =>
                    this.setState({ modalUpdate: false, detailProd: [] })
                  }
                >
                  Cancel
                </button>
                <button onClick={this.onUpdateAdd}>Update</button>
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
    this.setState({ modalUpdate: false, detailProd: [] });
  };

  render() {
    return (
      <div className="jumbotron-1-prowa">
        <ModalPW
          renderProd={this.renderDetail()}
          openDW={this.state.modalUpdate}
          closeDW={this.onCloseClick}
        />
        <div className="sidebar-prowa"> untuk side bar</div>
        <div className="prowa-content">
          <div className="prowa-title-content">
            <p>Warehouse Stock</p>
          </div>
          <div className="prowa-content-in">
            <div className="prowa-totaldata-info">
              <div>
                Total products <span>{this.state.totalData}</span>
              </div>
            </div>
            <div className="prowa-th">
              <div className="prowa-t1">
                <div>Image</div>
              </div>
              <div className="prowa-t2">
                <div>Name</div>
              </div>
              <div className="prowa-t3">
                <div>Price</div>
              </div>
              <div className="prowa-t4">
                <div>Stock</div>
              </div>
              <div className="prowa-t5">
                <div>Update</div>
              </div>
              <div className="prowa-t6">
                <div>Action</div>
              </div>
            </div>
            <div>{this.renderData()}</div>
          </div>
          <div className="prowa-pagination">
            <div>
              <TablePagination
                rowsPerPageOptions={[
                  5,
                  10,
                  15,
                  { label: "All", value: this.state.totalData },
                ]}
                component="div"
                count={this.state.totalData}
                page={this.state.page}
                rowsPerPage={this.state.limit}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeLimit}
                style={{ color: "grey" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductWarehouse;
