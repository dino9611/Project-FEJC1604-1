import React, { Component } from "react";
import { API_URL, currencyFormatter } from "./helper";
import Axios from "axios";
import {
  Table,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

class App extends Component {
  state = {
    products: [],
    AddData: {
      name: "",
      price: "",
      image: "",
      quantity: "",
      category: "",
      location: "",
    },
    categories: [],
    locations: [],
    addimage: null,
    modalAdd: false,
  };

  componentDidMount() {
    Axios.get(`${API_URL}/admin/product/all`)
      .then((res) => {
        Axios.get(`${API_URL}/admin/category`)
          .then((res1) => {
            Axios.get(`${API_URL}/admin/location`)
              .then((res2) => {
                this.setState({
                  products: res.data,
                  categories: res1.data,
                  locations: res2.data,
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

  toggle = () => {
    this.setState({ modalAdd: !this.state.modalAdd });
  };

  onAddFileChange = (e) => {
    console.log(e.target.files);
    if (e.target.files[0]) {
      this.setState({
        addimage: e.target.files[0],
      });
    } else {
      this.setState({ addimage: null });
    }
  };

  onAddDataChange = (e) => {
    let AddDatamute = this.state.AddData;
    AddDatamute[e.target.name] = e.target.value;
    this.setState({ AddData: AddDatamute });
  };

  onAddDataClick = () => {
    const { name, price, quantity, category, location } = this.state.AddData;
    const image = this.state.addimage;
    let dataPost = this.state.AddData;
    if (name && price && image && quantity && category && location) {
      console.log(name);
      console.log(price);
      console.log(image);
      console.log(quantity);
      console.log(category);
      console.log(location);
      let formData = new FormData();
      formData.append("data", JSON.stringify(dataPost));
      formData.append("image", image);
      Axios.post(`${API_URL}/admin/product/all`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          Axios.get(`${API_URL}/admin/product/all`)
            .then((res) => {
              console.log(res);
              this.setState({
                products: res.data,
                modalAdd: false,
                addimage: null,
                AddData: {
                  name: "",
                  price: "",
                  image: "",
                  quantity: "",
                  category: "",
                  location: "",
                },
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
    Axios.delete(`${API_URL}/admin/product/${id}`)
      .then(() => {
        Axios.get(`${API_URL}/admin/product/all`)
          .then((res) => {
            this.setState({ products: res.data });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
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
      return (
        <tr key={val.id}>
          <td width="10px">{index + 1}</td>
          <td width="100px">{val.name}</td>
          <td width="100px">{currencyFormatter(val.price)}</td>
          <td width="100px">
            {val.image ? (
              <img src={API_URL + val.image} width="150px" height="100vh" />
            ) : (
              "Unavailable"
            )}
          </td>
          <td width="100px">{val.quantity}</td>
          <td width="100px">{val.category}</td>
          <td width="100px">{val.location}</td>
          <td width="100px">
            <Button className="btn-primary">EDIT</Button>
            <Button
              onClick={() => this.onDeleteClick(index)}
              className="btn-primary"
            >
              DELETE
            </Button>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <>
        <Modal size="lg" isOpen={this.state.modalAdd} toggle={this.toggle}>
          <ModalHeader
            className="color"
            style={{ color: "#42a746" }}
            toggle={this.toggle}
          >
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
            <input
              className="form-control my-1"
              type="file"
              name="image"
              value={this.state.AddData.image}
              placeholder="Image"
              onChange={this.onAddFileChange}
            />
            <input
              className="form-control my-1"
              type="number"
              name="quantity"
              value={this.state.AddData.quantity}
              placeholder="Quantity"
              onChange={this.onAddDataChange}
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
            <select
              className="form-control my-1"
              name="location"
              value={this.state.AddData.location}
              onChange={this.onAddDataChange}
            >
              <option value="0" hidden>
                Choose Location
              </option>
              {this.renderLocation()}
            </select>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={this.onAddDataClick}
              style={{ backgroundColor: "#42a746", borderColor: "transparent" }}
            >
              Add
            </Button>
          </ModalFooter>
        </Modal>
        <div>
          <Button
            className="btn-success"
            style={{ margin: "10px" }}
            onClick={() => this.setState({ modalAdd: true })}
          >
            ADD
          </Button>
        </div>
        <div>
          <Table bordered>
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Price</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Location</th>
                <th>Button</th>
              </tr>
            </thead>
            <tbody>{this.renderProducts()}</tbody>
          </Table>
        </div>
      </>
    );
  }
}

export default App;
