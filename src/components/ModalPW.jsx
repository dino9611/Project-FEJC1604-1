import React, { Component } from "react";
import ReactDOM from "react-dom";
import { GrClose } from "react-icons/gr";
import Axios from "axios";
import { API_URL, currencyFormatter } from "./../helper";
import "./styles/ModalPW.css";

class ModalPW extends Component {
  state = {
    // dataProd: [],
  };

  //   componentDidMount() {
  //     let tokenAccess = localStorage.getItem("TA");
  //     Axios.get(`${API_URL}/adminProd/productsWarehouse`, {
  //       headers: { Authorization: "Bearer " + tokenAccess },
  //     })
  //       .then((res) => {
  //         this.setState({
  //           dataProd: res.data[0],
  //         });
  //         console.log(this.state.dataProd, "line 22");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }

  render() {
    // let data = this.state.dataProd;
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
          {/* <GrClose
            style={{
              marginTop: "15px",
              marginRight: "-90%",
              fontSize: "2rem",
              cursor: "pointer",
            }}
            onClick={this.props.closeDW}
          />
          <div className="modal-pw-title">Update Stock</div> */}
          {this.props.renderProd}
          {/* <div className="modal-pw-inside">
            <div className="modal-pw-img">
              <img src={API_URL + data.image} alt="" />
            </div>
            <div className="modal-pw-name">
              <div>{data.name}</div>
              <div className="modal-pw-cat">{data.category_name}</div>
              <div className="modal-pw-price">
                {currencyFormatter(data.price)}
              </div>
            </div>
          </div>
          <div className="modal-pw-bottom">
            <div className="modal-pw-input">
              <div>
                <div>CURRENT STOCK</div>
                <input type="number" placeholder={data.stock} disabled />
              </div>
              <div className="modal-pw-icon">
                <FaLongArrowAltRight
                  style={{ fontSize: "1.5rem", color: "grey" }}
                />
              </div>
              <div>
                <div>UPDATE TO</div>
                <input type="number" />
              </div>
            </div>
            <hr />
            <div className="modal-pw-button">
              <button>Cancel</button>
              <button>Update</button>
            </div>
          </div> */}
        </div>
      </div>,
      document.getElementById("portal")
    );
  }
}

export default ModalPW;
