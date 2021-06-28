import React, { Component } from "react";
import {
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import axios from "axios";
import Sidebar from "../../components/SideBar";
import { API_URL } from "../../helper";
import { connect } from "react-redux";
import Swal from 'sweetalert2';
class AddressList extends Component {
  state = {
    addAddress: {
      address: "",
      city: "",
      zip: "",
      description: "",
    },
    addresses: [],
    modalVisible: false,
  };

  componentDidMount() {
    axios
      .get(`${API_URL}/auth/address/${this.props.Auth.id}`)
      .then((res) => {
        console.log('isi res.data', res.data);
        this.setState({ addresses: res.data });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  renderAddress = () => {
    return this.state.addresses.map((val, index) => {
      return (
        <tr
          key={index}
          style={{ backgroundColor: val.is_default == 1 ? "#D4EAF5" : "white" }}
        >
          <td className="text-center">{index + 1}</td>
          <td>{val.address}</td>
          <td className="text-center">{val.city}</td>
          <td className="text-center">{val.zip}</td>
          <td>{val.description}</td>
          <td className="text-center">
            {" "}
            {val.is_default ? (
              "Default"
            ) : (
              <button className="button-second" onClick={() => this.onDefaultClick(index)}>Make Default</button>
            )}{" "}
          </td>
          <td className="text-center">
            <button className="button-cancel" onClick={() => this.onDeleteClick(index)}>
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  onDeleteClick = (index) => {
    let alamat = this.state.addresses;
    Swal.fire({
      title: `Are you sure want to delete ${alamat[index].address} ?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let address_id = alamat[index].id;
        let tokenAccess = localStorage.getItem("TA");
        axios.delete(`${API_URL}/auth/address/delete/${address_id}/${this.props.Auth.id}`)
          .then((res) => {
            this.setState({ addresses: res.data });
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
          }).catch((error) => {
            console.error(error);
          });
      }
    });
  };

  onDefaultClick = (index) => {
    console.log(index);
    const address_id = this.state.addresses[index].id;
    const users_id = this.props.Auth.id;
    Swal.fire({
      title: `Are you sure want to make detault ${this.state.addresses[index].address} ?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, make default'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`${API_URL}/auth/defaultaddress/${address_id}/${users_id}`)
          .then((res) => {
            this.setState({ addresses: res.data });
            Swal.fire(
              'Success!',
              'Address updated.',
              'success'
            );
          }).catch((error) => {
            console.error(error);
          });
      }
    });
  };

  onInputChange = (e) => {
    let data = this.state.addAddress;
    let dataAlamat = { ...data, [e.target.name]: e.target.value };
    this.setState({ addAddress: dataAlamat });
  };

  toggle = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  onAddClick = () => {
    let { city, address, zip, description } = this.state.addAddress;
    if (city && address && zip && description) {
      axios
        .get(`http://api.positionstack.com/v1/forward`, {
          params: {
            access_key: "82fd700377254a8002ecb47ba7b9d5c7",
            query: this.state.addAddress.city,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.data.length) {
            let data = {
              city,
              address,
              zip,
              description,
              latitude: res.data.data[0].latitude,
              longitude: res.data.data[0].longitude,
            };
            axios
              .post(`${API_URL}/auth/addAddress/${this.props.Auth.id}`, data)
              .then((res2) => {
                this.setState({
                  addresses: res2.data,
                  modalVisible: false,
                  addAddress: {
                    address: "",
                    city: "",
                    zip: "",
                    description: "",
                  },
                });
              })
              .catch((error) => {
                alert("server error");
              });
          } else {
            alert("kota tidak terdaftar");
          }
        })
        .catch((error) => {
          console.error(error);
          alert("server dalam pemeliharaan");
        });
    } else {
      alert("input kurang");
    }
  };

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.modalVisible}
          toggle={this.toggle}
          centered
          size="xl"
        >
          <ModalHeader toggle={this.toggle}>Add Address</ModalHeader>
          <ModalBody>
            <input
              placeholder="City"
              className="form-control my-3"
              name="city"
              value={this.state.addAddress.city}
              onChange={this.onInputChange}
            />
            <input
              placeholder="ZIP"
              className="form-control"
              name="zip"
              value={this.state.addAddress.zip}
              onChange={this.onInputChange}
            />
            <textarea
              placeholder="Address"
              className="form-control my-3"
              rows="5"
              name="address"
              value={this.state.addAddress.address}
              onChange={this.onInputChange}
            ></textarea>
            <textarea
              placeholder="Description"
              className="form-control my-3"
              rows="5"
              name="description"
              value={this.state.addAddress.description}
              onChange={this.onInputChange}
            ></textarea>
          </ModalBody>
          <ModalFooter>
            <button className="button-utama" onClick={this.onAddClick}>
              Add
            </button>
            <button className="button-cancel" onClick={this.toggle}>
              Cancel
            </button>
          </ModalFooter>
        </Modal>
        <Sidebar page="address">
          <Table>
            <thead>
              <tr className="text-center">
                <th>No</th>
                <th>Address</th>
                <th>City</th>
                <th>ZIP</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.renderAddress()}</tbody>
          </Table>
          <button className="button-utama" onClick={this.toggle}>
            Add Address
          </button>
        </Sidebar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Auth: state.Auth,
  };
};

export default connect(mapStateToProps)(AddressList);
