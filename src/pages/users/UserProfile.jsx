import React, { Component } from "react";
import { API_URL } from "../../helper";
import axios from "axios";
import { connect } from "react-redux";
import "../styles/userProfile.css";
import Sidebar from "../../components/SideBar";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import AlertAdmin from '../../components/AlertAdmin';


class UserProfile extends Component {
  state = {
    dataUser: {
      first_name: "",
      last_name: "",
      phone_number: "",
      age: "",
    },
    dataInit: {
      first_name: "",
      last_name: "",
      phone_number: "",
      age: "",
    },
    save: true,
    modalVisible: false,
    photo: null,
    photoDefault: null,
    openSnack: false,
    message: "",
    alertStatus: "",
    loading: false
  };

  componentDidMount() {
    axios
      .get(`${API_URL}/auth/${this.props.Auth.id}`)
      .then((res) => {
        console.log("ini res.data ke 0", res.data[0]);
        this.setState({
          dataUser: res.data[0],
          dataInit: res.data[0],
          photoDefault: res.data[0].photo,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  toggle = () => {
    this.setState({ modalVisible: !this.state.modalVisible, photo: null });
  };

  handleSnack = () => {
    this.setState({ openSnack: false, message: '', alertStatus: '' });
  };


  onInputChange = (e) => {
    let data = this.state.dataUser;
    let dataUsers = { ...data, [e.target.name]: e.target.value };
    this.setState({ dataUser: dataUsers, save: false });
  };

  onCancelClick = () => {
    let data = this.state.dataInit;
    this.setState({ dataUser: data, save: true });
  };

  onSaveClick = () => {
    let data = this.state.dataUser;
    console.log(data, "line 51");
    axios
      .post(`${API_URL}/auth/addData/${this.props.Auth.id}`, data)
      .then((res) => {
        this.setState({
          dataUser: res.data[0],
          dataInit: res.data[0],
          save: true,
          openSnack: true,
          alertStatus: 'success',
          loading: false,
          message: 'Profile updated!',
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  onUploadClick = () => {
    // upload & edit photo
    let formData = new FormData();
    formData.append("photo", this.state.photo);
    console.log(formData);
    const id = this.props.Auth.id;
    let tokenAccess = localStorage.getItem("TA");
    axios
      .post(`${API_URL}/auth/uploadphoto/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + tokenAccess,
        },
      })
      .then((res) => {
        console.log(res);
        this.setState({
          photo: null,
          modalVisible: false,
          photoDefault: res.data[0].photo,
          openSnack: true,
          alertStatus: 'success',
          loading: false,
          message: 'Profile picture changed!',
        });
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  addFileChange = (e) => {
    // console.log(e.target.files);
    if (e.target.files[0]) {
      this.setState({ photo: e.target.files[0] });
    } else {
      this.setState({ photo: null });
    }
  };

  render() {
    return (
      <div>
        {/* MODAL UPLOAD */}
        <Modal isOpen={this.state.modalVisible} toggle={this.toggle} centered>
          <ModalHeader toggle={this.toggle}>
            <div
              style={{
                marginLeft: "130px",
                color: "#052c43",
                fontWeight: "650",
              }}
            >
              Upload Your Picture
            </div>
          </ModalHeader>
          <ModalBody>
            {this.state.photo ? (
              <img
                style={{ marginLeft: "80px", height: "200px" }}
                src={URL.createObjectURL(this.state.photo)}
                alt="photo"
              />
            ) : null}
            <input
              type="file"
              className="form-control mt-3"
              onChange={this.addFileChange}
              name="photo"
            />
          </ModalBody>
          <ModalFooter>
            <button className="btn-upload-profile" onClick={this.onUploadClick}>
              Upload
            </button>
            <button className="btn-cancel-profile" onClick={this.toggle}>
              Cancel
            </button>
          </ModalFooter>
        </Modal>

        {/* SIDEBAR */}
        <Sidebar page="profile">
          <div style={{ marginTop: '50px' }}>
            <div className="d-flex justify-content-center">
              <div className="photo">
                <img
                  src={API_URL + this.state.photoDefault}
                  alt="photo"
                  height="100%"
                  width="100%"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            <p onClick={this.toggle} className="change-photo">
              Change Profile Picture
            </p>
            <div className="d-flex flex-column align-items-center mt-4">
              <div>
                <div className="d-flex">
                  <div>
                    <div>First Name</div>
                    <input
                      name="first_name"
                      type="text"
                      className="form-control mt-1 input-border"
                      placeholder="First Name"
                      value={this.state.dataUser.first_name}
                      onChange={this.onInputChange}
                    />
                  </div>
                  <div className="ml-5">
                    <div>Last Name</div>
                    <input
                      name="last_name"
                      className="form-control mt-1 input-border"
                      type="text"
                      placeholder="Last Name"
                      value={this.state.dataUser.last_name}
                      onChange={this.onInputChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="mt-3">
                    <div>Phone Number</div>
                    <input
                      name="phone_number"
                      className="form-control mt-1 input-width input-border"
                      type="text"
                      placeholder="Phone Number"
                      value={this.state.dataUser.phone_number}
                      onChange={this.onInputChange}
                    />
                  </div>
                  <div className="mt-3">
                    <div>Age</div>
                    <input
                      name="age"
                      className="form-control mt-1 input-border input-width"
                      type="number"
                      placeholder="Age"
                      value={this.state.dataUser.age}
                      onChange={this.onInputChange}
                    />
                  </div>
                </div>
                <div className="d-flex mt-5 justify-content-end">
                  <button
                    className="button-utama"
                    disabled={this.state.save}
                    onClick={this.onSaveClick}
                  >
                    Save
                  </button>
                  <button
                    className="button-cancel ml-4"
                    onClick={this.onCancelClick}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Sidebar>
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

const mapStateToProps = (state) => {
  return {
    Auth: state.Auth,
  };
};

export default connect(mapStateToProps, {})(UserProfile);
