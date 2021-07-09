import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
// import Image from "./../images/oops.png";
import Image from "./../images/modal-ch.svg";
import { GrClose } from "react-icons/gr";
import "./styles/ModalCH.css";

class ModalCH extends Component {
  state = {};
  render() {
    if (!this.props.openCH) return null;
    return ReactDOM.createPortal(
      <div className="overlay-modal-ch">
        <div className="modal-content-ch">
          <GrClose
            style={{
              marginTop: "-6px",
              marginRight: "-98%",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            onClick={this.props.closeCH}
          />
          <div className="modal-inside-ch">
            <img className="modal-image-ch" src={Image} alt="" />
            <p className="text-1-modal-ch">Oops . . .</p>
            <p className="text-2-modal-ch">
              You have to login first to see your cart!
            </p>
            <p className="text-3-modal-ch">Click the button below to login.</p>
            <Link to="/login" className="normal-link-modal">
              <button className="button-modal-ch">LOGIN</button>
            </Link>
          </div>
        </div>
      </div>,
      document.getElementById("portal")
    );
  }
}

export default ModalCH;
