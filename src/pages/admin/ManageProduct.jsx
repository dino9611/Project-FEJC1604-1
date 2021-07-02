import React, { Component } from "react";
import { API_URL, currencyFormatter } from "../../helper";
import Axios from "axios";
import {
  Table,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CustomInput,
} from "reactstrap";
import {
  BsChevronRight,
  BsChevronLeft,
  BsSearch,
  BsPlus,
} from "react-icons/bs";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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
    addimage: null,
    editimage: null,
    modalAdd: false,
    modalEdit: false,
    indexEdit: -1,
    limit: 10,
    totaldata: 0,
    minPage: 0,
    maxPage: 5,
    pageLimit: 5,
    page: 1,
  };

  componentDidMount() {
    Axios.get(`${API_URL}/admin/product?pages=${this.state.page}&limit=10`)
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
    console.log(this.state.products);
    if (this.state.page !== prevstate.page) {
      Axios.get(`${API_URL}/admin/product?pages=${this.state.page}&limit=10`)
        .then((res) => {
          this.setState({
            products: res.data.dataProduct,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  nextButton = () => {
    const { page, maxPage, minPage, pageLimit } = this.state;
    this.setState({ page: page + 1 });
    if (page + 1 > maxPage) {
      this.setState({ maxPage: maxPage + pageLimit });
      this.setState({ minPage: minPage + pageLimit });
    }
  };

  prevButton = () => {
    const { page, maxPage, minPage, pageLimit } = this.state;
    this.setState({ page: page - 1 });
    if ((page - 1) % pageLimit == 0) {
      this.setState({ maxPage: maxPage - pageLimit });
      this.setState({ minPage: minPage - pageLimit });
    }
  };

  toggle = () => {
    this.setState({ modalAdd: !this.state.modalAdd });
  };

  toggleEdit = () => {
    this.setState({ modalEdit: !this.state.modalEdit });
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
          Axios.get(
            `${API_URL}/admin/product?pages=${this.state.page}&limit=10`
          )
            .then((res1) => {
              alert("Data berhasil ditambahkan");
              this.setState({
                products: res1.data.dataProduct,
                modalAdd: false,
                addimage: null,
                AddData: {
                  name: "",
                  price: "",
                  image: "",
                  category: "",
                },
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
      alert("harus diisi inputnya!");
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
          Axios.get(
            `${API_URL}/admin/product?pages=${this.state.page}&limit=10`
          )
            .then((res1) => {
              alert("Data berhasil diedit");
              this.setState({
                products: res1.data.dataProduct,
                modalEdit: false,
                editimage: null,
                EditData: {
                  name: "",
                  price: "",
                  image: "",
                  category: "",
                },
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
    } else {
      alert("harus diisi inputnya!");
    }
  };

  onDeleteClick = (index) => {
    let id = this.state.products[index].id;
    let name = this.state.products[index].name;
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
            Axios.get(
              `${API_URL}/admin/product?pages=${this.state.page}&limit=10`
            )
              .then((res1) => {
                this.setState({
                  products: res1.data.dataProduct,
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
      }
    });
  };

  renderPagination = () => {
    let { limit, totaldata, page, maxPage, minPage } = this.state;
    let panjang = Math.ceil(totaldata / limit);
    let paging = [];
    for (let i = 1; i <= panjang; i++) {
      paging.push(i);
    }
    let renderPageNumber = paging.map((number) => {
      if (number < maxPage + 1 && number > minPage) {
        return (
          <li
            key={number}
            id={number}
            onClick={() => this.setState({ page: number })}
            className={page == number ? "active" : null}
          >
            {number}
          </li>
        );
      } else {
        return null;
      }
    });
    return renderPageNumber;
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
      let x = this.state.limit * (this.state.page - 1);
      return (
        <tr key={val.id}>
          <td width="50px">{x + index + 1}</td>
          <td width="200px">{val.name}</td>
          <td width="180px">{currencyFormatter(val.price)}</td>
          <td width="220px">
            <div style={{ height: "100px", overflow: "hidden" }}>
              {val.image ? (
                <img src={API_URL + val.image} height="100%" />
              ) : (
                "Unavailable"
              )}
            </div>
          </td>
          <td width="100px">{val.quantity}</td>
          <td width="120px">{val.category}</td>
          <td>
            <div
              style={{
                display: "flex",

                alignItems: "center",
                justifyContent: "space-evenly",
                marginTop: "4%",
              }}
            >
              <FaEdit onClick={() => this.onEditClick(index)} />
              <FaTrash onClick={() => this.onDeleteClick(index)} />
            </div>
          </td>
        </tr>
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

  render() {
    return (
      <div className="jumbotron">
        <div className="kiri">
          <div className="nama-admin">Admin Fournir</div>
        </div>
        <div className="kanan">
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

          <div className="header">
            <div className="search-content">
              <input
                type="text"
                placeholder="Search..."
                className="search-bar"
              />
              <BsSearch style={{ color: "grey", fontSize: "18px" }} />
            </div>
          </div>
          <div className="kanan-title">
            <div>Manage Product</div>
            <div>
              <button
                className="button-add"
                onClick={() => this.setState({ modalAdd: true })}
              >
                <BsPlus />
              </button>
            </div>
          </div>
          <div className="table-content">
            <Table className="table-parent" bordered>
              <thead className="table-head ">
                <tr style={{ color: "#052c43" }}>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="table-body">{this.renderProducts()}</tbody>
            </Table>
          </div>
          <div className="pagination-content">
            <ul className="page-number">
              <li>
                <button
                  disabled={this.state.page == 1 ? true : false}
                  onClick={() => this.prevButton()}
                >
                  <BsChevronLeft
                    style={{ fontSize: "20px", color: "#052c43" }}
                  />
                </button>
              </li>
              {this.renderPagination()}
              <li>
                <button
                  disabled={
                    this.state.page ==
                    Math.ceil(this.state.totaldata / this.state.limit)
                      ? true
                      : false
                  }
                  onClick={() => this.nextButton()}
                >
                  <BsChevronRight
                    style={{ fontSize: "20px", color: "#052c43" }}
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageProd;
