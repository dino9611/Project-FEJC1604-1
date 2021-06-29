import React, { Component } from "react";
import Header from "../../components/Header";
import { API_URL, currencyFormatter } from "../../helper";
import Axios from "axios";
import { BsFillBagFill } from "react-icons/bs";
import "../styles/ProductDetail.css";
import { connect } from 'react-redux';
import { CartAction } from '../../redux/actions/authAction';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

class ProductDetail extends Component {
  state = {
    product: {},
    qty: 1,
    loading: true,
  };

  componentDidMount() {
    console.log('ini dataUser', this.props.dataUser);
    let id = this.props.match.params.id;
    let data = this.props.location.state;
    console.log(data);
    if (!data) {
      Axios.get(`${API_URL}/product/productDetail/${id}`)
        .then((res) => {
          console.log(res.data, 'ini dari backend');
          this.setState({ product: res.data });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    } else {
      console.log('isi data.product', data.product);
      this.setState({ product: data.product, loading: false });
    }
  }

  quantityClick = (operator) => {
    console.log(this.state.product);
    if (operator === "plus") {
      var hasil = this.state.qty + 1;
      if (hasil > this.state.product.quantity) {
        alert("Out of Stock");
      } else {
        this.setState({ qty: this.state.qty + 1 });
      }
    } else {
      var hasil = this.state.qty - 1;
      if (hasil < 1) {
        alert("Less than 1");
      } else {
        this.setState({ qty: this.state.qty - 1 });
      }
    }
  };

  //======================== Function Add To Cart ( Willy ) ===========================//
  addToCart = () => {
    console.log(this.props.dataUser);
    if (this.props.dataUser.islogin === false) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `You must login first!`,
      });
      return;
    }
    if (this.props.dataUser.is_verified === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Please verify your account`,
      });
      return;
    }
    if (this.props.dataUser.role != 1) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Admin can't buy product`,
      });
    } else {
      let users_id = this.props.dataUser.id;
      let prod_id = this.state.product.id;
      let qty = this.state.qty;
      let tokenAccess = localStorage.getItem("TA");
      console.log('isi tokenAccess', tokenAccess);
      let data = {
        users_id: users_id,
        prod_id: prod_id,
        qty: qty
      };
      let option = {
        headers: {
          Authorization: 'Bearer ' + tokenAccess
        }
      };
      Axios.post(`${API_URL}/transaction/cart`, data, option)
        .then((res) => {
          console.log('isi dari res.data', res.data);
          this.props.CartAction(res.data);
          toast.success('Product added to cart', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        }).catch((error) => {
          console.error('line 103', error);
          alert(error.response.data.message);
        });
    }
  };

  render() {
    return (
      <div>
        <Header />
        <div className="detail-content">
          <div className="detail-content-1">
            <div className="image-content">
              <img
                className="image-detail"
                src={API_URL + this.state.product.image}
                alt="Product"
              />
            </div>
            <div className="detail-info">
              <div className="detail-name">{this.state.product.name}</div>
              <div className="detail-description">
                {this.state.product.description}
              </div>
              <div className="detail-price">
                {currencyFormatter(this.state.product.price)}
              </div>
              <div className="detail-penjualan">
                <p>125 people buy this product</p>
              </div>
              <hr />
              <div className="detail-ongkir">
                <p>Shipping fees start from Rp16.000</p>
              </div>
              <hr />
              <div className="detail-quantity">
                <p>Amount:</p>
                <button
                  className="button-minus"
                  onClick={() => this.quantityClick("minus")}
                  disabled={this.state.qty === 1 ? true : false}
                >
                  <div>-</div>
                </button>
                <button className="button-qty">
                  {this.state.product.quantity === null ? "0" : this.state.qty}
                </button>
                <button
                  className="button-plus"
                  onClick={() => this.quantityClick("plus")}
                  disabled={
                    this.state.qty == this.state.product.quantity ||
                      this.state.product.quantity == null
                      ? true
                      : false
                  }
                >
                  <div>+</div>
                </button>
              </div>
              <div className="detail-button-cart">
                <button onClick={this.addToCart}>
                  <div>
                    <BsFillBagFill style={{ color: "white" }} />
                  </div>
                  <div>Add to your cart</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataUser: state.Auth
  };
};

export default connect(mapStateToProps, { CartAction })(ProductDetail);