import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import Image from "./../images/oops.png";
import { BsXCircleFill } from "react-icons/bs";
import "./styles/ModalCH.css";

class ModalCH extends Component {
  state = {};
  render() {
    if (!this.props.open) return null;
    return ReactDOM.createPortal(
      <div className="overlay-modal">
        <div className="modal-content">
          <BsXCircleFill
            className="close-button-modal"
            onClick={this.props.close}
          />
          <img className="modal-image" src={Image} alt="" />
          <p className="text-1-modal">Oops...</p>
          <p className="text-2-modal">
            You have to login first to see <br /> your cart and history !
          </p>
          <p className="text-3-modal">Click the button below to login.</p>
          <Link to="/login" className="normal-link-modal">
            <button className="button-modal">LOGIN</button>
          </Link>
        </div>
      </div>,
      document.getElementById("portal")
    );
  }
}

export default ModalCH;
