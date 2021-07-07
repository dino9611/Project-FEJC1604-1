import React, { Component } from "react";
import Axios from "axios";
import ReactDOM from "react-dom";
import { API_URL } from "./../helper";
import { GrClose } from "react-icons/gr";
import { withStyles } from "@material-ui/core/styles";
import { Select, MenuItem, InputBase } from "@material-ui/core";
import "./styles/ModalAA.css";

class ModalAA extends Component {
  state = {};

  render() {
    if (!this.props.openAA) return null;
    return ReactDOM.createPortal(
      <div className="overlay-modal-aa">
        <div className="modal-aa-content">
          <div className="modal-aa-header">
            <GrClose
              style={{
                fontSize: "1rem",
                cursor: "pointer",
              }}
              onClick={this.props.closeAA}
            />
            <div className="modal-aa-title">{this.props.name}</div>
          </div>
          {this.props.renderUser}
        </div>
      </div>,
      document.getElementById("portal")
    );
  }
}

export default ModalAA;
