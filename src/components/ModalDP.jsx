import React, { Component } from "react";
import ReactDOM from "react-dom";
import { GrClose } from "react-icons/gr";
import "./styles/ModalDP.css";

class ModalDP extends Component {
  state = {};

  render() {
    if (!this.props.openDP) return null;
    return ReactDOM.createPortal(
      <div className="overlay-modal-dp">
        <div className="modal-dp-content">
          <GrClose
            style={{
              marginTop: "-15px",
              marginRight: "-102%",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            onClick={this.props.closeDP}
          />
          <div className="modal-dp-title">Transaction Detail</div>
          <div className="modal-dp-inside">
            <div className="modal-dp-info">
              <p>Invoice Number</p>
              <p>{this.props.invoiceDP}</p>
            </div>
            <div className="modal-dp-info">
              <p>Status</p>
              <p style={{ textTransform: "capitalize" }}>
                {this.props.statusDP}
              </p>
            </div>
            <div className="modal-dp-info">
              <p>Transaction Date</p>
              <p>
                {this.props.dateDP}, {this.props.hourDP} WIB
              </p>
            </div>
            <hr width="100%" />
            {this.props.renderDP}
            <hr width="100%" />
          </div>
        </div>
      </div>,
      document.getElementById("portal")
    );
  }
}

export default ModalDP;
