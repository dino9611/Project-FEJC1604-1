import React, { Component } from "react";
import { API_URL, currencyFormatter } from "../../helper";
import Axios from "axios";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CustomInput,
} from "reactstrap";
import { BsPlus } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { Select, MenuItem, InputBase } from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import { FaEdit, FaTrash } from "react-icons/fa";
import { styles } from "./../../components/PaginationStyle";
import { withStyles } from "@material-ui/core/styles";
import AlertAdmin from "../../components/AlertAdmin";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Empty from "./../../images/pf-empty.svg";
import "../styles/ManageProduct.css";

const Myswal = withReactContent(Swal);

class ManageProd extends Component {
  state = {
    products: [],
    AddData: {
      name: "",
      price: "",
      image: "",
      category: "",
    },
    EditData: {
      name: "",
      price: "",
      image: "",
      category: "",
    },
    qty: [],
    categories: [],
    locations: [],
    statusCategory: [],
    addimage: null,
    editimage: null,
    modalAdd: false,
    modalEdit: false,
    indexEdit: -1,
    limit: 10,
    totaldata: 0,
    page: 0,
    searchInput: "",
    openSnack: false,
    message: "",
    alertStatus: "",
  };

  componentDidMount() {
    let tokenAccess = localStorage.getItem("TA");
    Axios.get(`${API_URL}/admin/product`, {
      headers: { Authorization: "Bearer " + tokenAccess },
      params: {
        pages: this.state.page,
        limit: this.state.limit,
      },
    })
      .then((res1) => {
        Axios.get(`${API_URL}/admin/category`)
          .then((res2) => {
            Axios.get(`${API_URL}/admin/location`)
              .then((res3) => {
                this.setState({
                  totaldata: res1.data.totaldata,
                  products: res1.data.dataProduct,
                  categories: res2.data,
                  locations: res3.data,
                  qty: res3.data.map(({ id }) => ({
                    warehouse_id: id,
                    qty: 0,
                  })),
                });
              })
              .catch((err) => {
                console.log(err);
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

  componentDidUpdate(prevprops, prevstate) {
    let tokenAccess = localStorage.getItem("TA");
    if (
      this.state.page !== prevstate.page ||
      this.state.limit !== prevstate.limit ||
      this.state.statusCategory !== prevstate.statusCategory ||
      this.state.searchInput !== prevstate.searchInput
    ) {
      Axios.get(`${API_URL}/admin/product`, {
        headers: { Authorization: "Bearer " + tokenAccess },
        params: {
          pages: this.state.page,
          limit: this.state.limit,
          status:
            this.state.statusCategory === "All"
              ? ""
              : this.state.statusCategory,
          search: this.state.searchInput,
        },
      })
        .then((res) => {
          this.setState({
            products: res.data.dataProduct,
            totaldata: res.data.totaldata,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  toggle = () => {
    this.setState({ modalAdd: !this.state.modalAdd });
  };

  toggleEdit = () => {
    this.setState({ modalEdit: !this.state.modalEdit });
  };

  handleSnack = () => {
    this.setState({ openSnack: false, message: "", alertStatus: "" });
  };

  categoryChange = (e) => {
    this.setState({ statusCategory: e.target.value });
  };

  searchChange = (e) => {
    this.setState({ searchInput: e.target.value });
  };

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

  onAddFileChange = (e, propstate) => {
    if (e.target.files[0]) {
      this.setState({
        [propstate]: e.target.files[0],
      });
    } else {
      this.setState({ [propstate]: null });
    }
  };

  onAddDataChange = (e) => {
    let AddDatamute = this.state.AddData;
    AddDatamute[e.target.name] = e.target.value;
    this.setState({ AddData: AddDatamute });
  };

  onAddQtyChange = (e, index, id) => {
    let AddDataQty = this.state.qty;
    AddDataQty[index] = { qty: e.target.value, warehouse_id: id };
    this.setState({ qty: AddDataQty });
  };

  onEditDataChange = (e) => {
    let EditDatamute = this.state.EditData;
    EditDatamute[e.target.name] = e.target.value;
    this.setState({ EditData: EditDatamute });
  };

  onEditQtyChange = (e, index, id) => {
    let EditDataQty = this.state.qty;
    EditDataQty[index] = { qty: e.target.value, warehouse_id: id };
    this.setState({ qty: EditDataQty });
  };

  qtyValidation = (arr) => {
    let arrloc = this.state.locations.length;
    let arrfilter = arr.filter((val) => val);
    return arrloc == arrfilter.length ? true : false;
  };

  onAddDataClick = () => {
    const image = this.state.addimage;
    const qty = this.state.qty;
    const { name, price, category } = this.state.AddData;
    let dataPost = { name, price, qty, category };
    let tokenAccess = localStorage.getItem("TA");
    console.log(dataPost);
    if (name && price && this.qtyValidation(qty) && image && category) {
      let formData = new FormData();
      formData.append("data", JSON.stringify(dataPost));
      formData.append("image", image);
      Axios.post(`${API_URL}/admin/product/all`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          Axios.get(`${API_URL}/admin/product`, {
            headers: { Authorization: "Bearer " + tokenAccess },
            params: {
              pages: this.state.page,
              limit: this.state.limit,
            },
          })
            .then((res1) => {
              this.setState({
                products: res1.data.dataProduct,
                modalAdd: false,
                addimage: null,
                AddData: {
                  name: "",
                  price: "",
                  image: "",
                  category: "",
                  message: "Data added successfuly",
                  openSnack: true,
                  alertStatus: "success",
                },
                message: `${name} has been added!`,
                alertStatus: "success",
                openSnack: true,
                qty: this.state.qty.map((data) => ({ ...data, qty: 0 })),
                totaldata: res1.data.totaldata,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.setState({
        alertStatus: "error",
        message: "Data must be filled correctly to update!",
        openSnack: true,
      });
    }
  };

  onEditClick = (index) => {
    console.log(this.state.products[index]);
    let EditData = this.state.EditData;
    let data = this.state.products[index];
    EditData = {
      ...EditData,
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.image,
      category: data.category_id,
    };
    this.setState({ indexEdit: index, EditData: EditData, modalEdit: true });
  };

  onEditDataClick = () => {
    const image = this.state.editimage;
    const { name, price, category } = this.state.EditData;
    let dataPost = { name, price, category };
    let id = this.state.EditData.id;
    let tokenAccess = localStorage.getItem("TA");
    if (name || price || image || category) {
      let formData = new FormData();
      formData.append("data", JSON.stringify(dataPost));
      formData.append("image", image);
      Axios.put(`${API_URL}/admin/product/all/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          Axios.get(`${API_URL}/admin/product`, {
            headers: { Authorization: "Bearer " + tokenAccess },
            params: {
              pages: this.state.page,
              limit: this.state.limit,
            },
          })
            .then((res1) => {
              this.setState({
                products: res1.data.dataProduct,
                modalEdit: false,
                editimage: null,
                EditData: {
                  name: "",
                  price: "",
                  image: "",
                  category: "",
                  message: "Data edited successfuly",
                  openSnack: true,
                  alertStatus: "success",
                },
                message: `Update for ${name} success!`,
                alertStatus: "success",
                openSnack: true,
                indexEdit: -1,
                totaldata: res1.data.totaldata,
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
        alertStatus: "error",
        message: "Data must be filled correctly to update!",
        openSnack: true,
      });
    }
  };

  onDeleteClick = (index) => {
    let id = this.state.products[index].id;
    let name = this.state.products[index].name;
    let tokenAccess = localStorage.getItem("TA");
    Myswal.fire({
      title: `Are you sure want to Delete ${name}`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89ADC3",
      cancelButtonColor: "grey",
      confimButtonText: "Yes, delete it!!",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`${API_URL}/admin/product/${id}`)
          .then(() => {
            Axios.get(`${API_URL}/admin/product`, {
              headers: { Authorization: "Bearer " + tokenAccess },
              params: {
                pages: this.state.page,
                limit: this.state.limit,
              },
            })
              .then((res1) => {
                this.setState({
                  products: res1.data.dataProduct,
                  totaldata: res1.data.totaldata,
                  message: `${name} has been deleted!`,
                  alertStatus: "success",
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
      }
    });
  };

  renderCategories = () => {
    return this.state.categories.map((val, index) => {
      return (
        <option value={val.id} key={index}>
          {val.category_name}
        </option>
      );
    });
  };

  renderCategoryFilter = () => {
    return this.state.categories.map((val, index) => {
      return (
        <MenuItem key={index} value={val.category_name}>
          <span>{val.category_name}</span>
        </MenuItem>
      );
    });
  };

  renderLocation = () => {
    return this.state.locations.map((val, index) => {
      return (
        <option value={val.id} key={index}>
          {val.location}
        </option>
      );
    });
  };

  renderProducts = () => {
    return this.state.products.map((val, index) => {
      let x = this.state.limit * this.state.page;
      return (
        <div className="mp-render-data" key={index}>
          <div className="mp-render-in">
            <div className="mp-prod-num">{x + index + 1}.</div>
          </div>
          <div className="mp-render-in mp-prod-img">
            <img width="100%" src={API_URL + val.image} alt="" />
          </div>
          <div className="mp-render-in">
            <div className="mp-prod-name">{val.name}</div>
          </div>
          <div className="mp-render-in">
            <div className="mp-prod-price">{currencyFormatter(val.price)}</div>
          </div>
          <div className="mp-render-in">
            <div
              style={{ color: val.quantity === 0 ? "red" : "black" }}
              className="mp-prod-qty"
            >
              {val.quantity}
            </div>
          </div>
          <div className="mp-render-in">
            <div className="mp-prod-cat">{val.category}</div>
          </div>
          <div className="mp-render-in mp-render-button">
            <div className="mp-prod-edit">
              <FaEdit onClick={() => this.onEditClick(index)} />
            </div>
            <div className="mp-prod-delete">
              <FaTrash onClick={() => this.onDeleteClick(index)} />{" "}
            </div>
          </div>
        </div>
      );
    });
  };

  renderQuantity = () => {
    return this.state.locations.map((val, index) => {
      return (
        <div className="input-group my-1" key={index}>
          <input
            className="form-control"
            type="number"
            name="quantity"
            value={this.state.qty[index].qty}
            placeholder="Quantity"
            onChange={(e) => this.onAddQtyChange(e, index, val.id)}
          />
          <span style={{ width: "38%" }} className="input-group-text">
            {val.location}
          </span>
        </div>
      );
    });
  };

  handleSnack = () => {
    this.setState({ openSnack: false, message: "", alertStatus: "" });
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
      <div className="jumbotron-mp">
        <div className="kanan-mp">
          {/*===========Moal Add Data==========*/}
          <Modal size="lg" isOpen={this.state.modalAdd} toggle={this.toggle}>
            <ModalHeader className="color" toggle={this.toggle}>
              Add Data{" "}
            </ModalHeader>
            <ModalBody>
              <input
                className="form-control my-1"
                type="text"
                name="name"
                value={this.state.AddData.name}
                placeholder="Products Name"
                onChange={this.onAddDataChange}
              />
              <input
                className="form-control my-1"
                type="number"
                name="price"
                value={this.state.AddData.price}
                placeholder="Price"
                onChange={this.onAddDataChange}
              />
              <CustomInput
                type="file"
                onChange={(e) => this.onAddFileChange(e, "addimage")}
                label={
                  this.state.AddData.image
                    ? this.state.AddData.image.filename
                    : "No file"
                }
              />
              <select
                className="form-control my-1"
                name="category"
                value={this.state.AddData.category}
                onChange={this.onAddDataChange}
              >
                <option value="0" hidden>
                  Choose Category
                </option>
                {this.renderCategories()}
              </select>
              {this.renderQuantity()}
            </ModalBody>
            <ModalFooter>
              <Button
                style={{ backgroundColor: "#89adc3" }}
                onClick={this.onAddDataClick}
              >
                Add
              </Button>
            </ModalFooter>
          </Modal>
          {/*=========== Modal Edit Data ============*/}
          <Modal
            size="lg"
            isOpen={this.state.modalEdit}
            toggle={this.toggleEdit}
          >
            <ModalHeader className="color" toggle={this.toggleEdit}>
              Edit Data
            </ModalHeader>
            <ModalBody>
              <input
                className="form-control my-1"
                type="text"
                name="name"
                value={this.state.EditData.name}
                placeholder="Products Name"
                onChange={this.onEditDataChange}
              />
              <input
                className="form-control my-1"
                type="number"
                name="price"
                value={this.state.EditData.price}
                placeholder="Price"
                onChange={this.onEditDataChange}
              />
              <CustomInput
                type="file"
                onChange={(e) => this.onAddFileChange(e, "editimage")}
                label={
                  this.state.EditData.image
                    ? this.state.EditData.image.filename
                    : "No file"
                }
              />
              <select
                className="form-control my-1"
                name="category"
                value={this.state.EditData.category}
                onChange={this.onEditDataChange}
              >
                <option value="0" hidden>
                  Choose Category
                </option>
                {this.renderCategories()}
              </select>
            </ModalBody>
            <ModalFooter>
              <Button
                style={{ backgroundColor: "#89adc3" }}
                onClick={this.onEditDataClick}
              >
                Save
              </Button>
            </ModalFooter>
          </Modal>
          <div className="header-mp">
            <div className="header-mp-title">
              <p>Manage Product</p>
            </div>
          </div>
          <div className="kanan-title-mp">
            <div>
              <button
                className="button-add"
                onClick={() => this.setState({ modalAdd: true })}
              >
                <BsPlus />
                Add Product
              </button>
            </div>
            <div>
              <div>
                <Select
                  input={<BootstrapInput />}
                  value={this.state.statusCategory}
                  onChange={this.categoryChange}
                  displayEmpty
                  className="select-mp"
                >
                  <MenuItem value="" disabled>
                    Choose category
                  </MenuItem>
                  <MenuItem value="All">All Category</MenuItem>
                  {this.renderCategoryFilter()}
                </Select>
              </div>
              <div className="searchbar-content-mp">
                <input
                  className="searchbar-mp"
                  type="text"
                  placeholder="Search product name"
                  value={this.state.searchInput}
                  onChange={this.searchChange}
                />
                <div className="search-logo-mp">
                  <FiSearch
                    style={{
                      fontSize: "1.2rem",
                      color: "black",
                      height: "100%",
                      color: "grey",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mp-table-content">
            <div className="mp-th">
              <div className="mp-t1">
                <div>No.</div>
              </div>
              <div className="mp-t2">
                <div>Image</div>
              </div>
              <div className="mp-t3">
                <div>Name</div>
              </div>
              <div className="mp-t4">
                <div>Price</div>
              </div>
              <div className="mp-t5">
                <div>Stock</div>
              </div>
              <div className="mp-t6">
                <div>Category</div>
              </div>
              <div className="mp-t7">
                <div>Action</div>
              </div>
            </div>
            {/* <div>{this.renderProducts()}</div> */}
            <div>
              {!this.state.products.length ? (
                <div className="mp-empty-result">
                  <img src={Empty} alt="" />
                  <div className="mp-warning">
                    <p>No Results Found.</p>
                    {this.state.searchInput ? (
                      <p>
                        We couldn't find a match for "{this.state.searchInput}".
                        Please try another.
                      </p>
                    ) : (
                      <p>
                        We couldn't find a match for this status. Please try
                        another.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                this.renderProducts()
              )}
            </div>
          </div>
        </div>
        <div className="pagination-content">
          <div>
            <TablePagination
              rowsPerPageOptions={[
                5,
                10,
                15,
                { label: "All", value: this.state.totaldata },
              ]}
              component="div"
              count={this.state.totaldata}
              page={this.state.page}
              rowsPerPage={this.state.limit}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeLimit}
              style={{ color: "grey" }}
            />
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

export default withStyles(styles)(ManageProd);
