import React, { Component } from "react";
import ReactDOM from "react-dom";
import { GrClose } from "react-icons/gr";
import "./styles/ModalPW.css";

class ModalPW extends Component {
  state = {};

  render() {
    if (!this.props.openDW) return null;
    return ReactDOM.createPortal(
      <div className="overlay-modal-pw">
        <div className="modal-pw-content">
          <div className="modal-pw-header">
            <GrClose
              style={{
                fontSize: "1rem",
                cursor: "pointer",
              }}
              onClick={this.props.closeDW}
            />
            <div className="modal-pw-title">Update Stock</div>
          </div>
          {this.props.renderProd}
        </div>
      </div>,
      document.getElementById("portal")
    );
  }
}

export default ModalPW;
