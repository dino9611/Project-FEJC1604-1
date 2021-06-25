import React, { Component } from "react";
import { API_URL } from "../../helper";
import axios from "axios";
import { connect } from "react-redux";
import "../styles/userProfile.css";
import Sidebar from "../../components/SideBar";
import { toast } from "react-toastify";

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
  };

  componentDidMount() {
    axios
      .get(`${API_URL}/auth/${this.props.Auth.id}`)
      .then((res) => {
        console.log(res.data[0]);
        this.setState({ dataUser: res.data[0], dataInit: res.data[0] });
      })
      .catch((err) => {
        console.error(err);
      });
  }

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
        });
        toast.success("Profile updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <div>
        <Sidebar page="profile">
          <div className="">
            <div className="d-flex justify-content-center">
              <div className="photo">
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  alt="photo"
                  height="100%"
                  width="100%"
                />
              </div>
            </div>
            <div className="d-flex flex-column align-items-center mt-5">
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
