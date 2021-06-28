import React, { Component } from "react";
import "../styles/userProfile.css";
import Sidebar from "../../components/SideBar";

class Security extends Component {
  state = {};
  render() {
    return (
      <div>
        <Sidebar page="security"></Sidebar>
      </div>
    );
  }
}

export default Security;
