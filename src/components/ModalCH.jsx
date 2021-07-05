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
      <div className="overlay-modal-ch">
        <div className="modal-content-ch">
          <BsXCircleFill
            className="close-button-modal-ch"
            onClick={this.props.close}
          />
          <img className="modal-image-ch" src={Image} alt="" />
          <p className="text-1-modal-ch">Oops...</p>
          <p className="text-2-modal-ch">
            You have to login first to see <br /> your cart and history !
          </p>
          <p className="text-3-modal-ch">Click the button below to login.</p>
          <Link to="/login" className="normal-link-modal">
            <button className="button-modal-ch">LOGIN</button>
          </Link>
        </div>
      </div>,
      document.getElementById("portal")
    );
  }
}

export default ModalCH;
