import React, { Component } from "react";
import Header from "../../components/Header";
import { API_URL, currencyFormatter } from "../../helper";
import Axios from "axios";
import Loader from "react-loader-spinner";
import AddIcon from "@material-ui/icons/Add";
import { connect } from "react-redux";
import "../styles/ProductDetail.css";
import { CartAction } from "../../redux/actions/authAction";
import Swal from "sweetalert2";
import AlertAdmin from "../../components/AlertAdmin";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import LoaderComp from '../../components/Loader';

class ProductDetail extends Component {
  state = {
    product: {},
    qty: 1,
    loading: true,
    openSnack: false,
    message: "",
    alertStatus: "",
    wishlist: []
  };

  componentDidMount() {
    console.log("ini dataUser", this.props.dataUser);
    let id = this.props.match.params.id;
    let data = this.props.location.state;
    // console.log('ini product', data);
    Axios.get(`${API_URL}/auth/getwish/${this.props.dataUser.id}`)
      .then((res) => {
        console.log('ini res.data', res.data);
        this.setState({ wishlist: res.data, loading: false });
        console.log('ini state wish', this.state.wishlist);
      }).catch((error) => {
        console.error(error);
        this.setState({
          loading: false,
          openSnack: true,
          message: error.response.data.message,
          alertStatus: "error",
        });
      });
    if (!data) {
      Axios.get(`${API_URL}/product/productDetail/${id}`)
        .then((res) => {
          console.log(res.data, "ini dari backend");
          this.setState({ product: res.data });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    } else {
      console.log("isi data.product", data.product);
      this.setState({ product: data.product, loading: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.state.wishlist.length !== prevState.wishlist.length)) {
      Axios.get(`${API_URL}/auth/getwish/${this.props.dataUser.id}`)
        .then((res) => {
          // console.log('ini res.data', res.data);
          this.setState({ wishlist: res.data });
          console.log('ini state wish', this.state.wishlist);
        }).catch((error) => {
          console.error(error);
          this.setState({
            loading: false,
            openSnack: true,
            message: error.response.data.message,
            alertStatus: "error",
          });
        });
    }
  }

  quantityClick = (operator) => {
    console.log(this.state.product);
    if (operator === "plus") {
      var hasil = this.state.qty + 1;
      if (hasil > this.state.product.quantity) {
        this.setState({
          message: "Out of stock",
          openSnack: true,
          alertStatus: "warning",
          loading: false,
        });
      } else {
        this.setState({ qty: this.state.qty + 1 });
      }
    } else {
      hasil = this.state.qty - 1;
      if (hasil < 1) {
        this.setState({
          message: "Less than 1",
          openSnack: true,
          alertStatus: "warning",
          loading: false,
        });
      } else {
        this.setState({ qty: this.state.qty - 1 });
      }
    }
  };

  handleSnack = () => {
    this.setState({ openSnack: false, message: "", alertStatus: "" });
  };

  //======================== Function Add To Cart ( Willy ) ===========================//
  addToCart = () => {
    // console.log(this.props.dataUser);
    if (this.props.dataUser.islogin === false) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `You must register and login first!`,
      });
      return;
    }
    if (this.props.dataUser.is_verified === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Please verify your account`,
      });
      return;
    }
    if (this.props.dataUser.role != 1) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Admin can't buy product`,
      });
    } else {
      let users_id = this.props.dataUser.id;
      let prod_id = this.state.product.id;
      let qty = this.state.qty;
      let tokenAccess = localStorage.getItem("TA");
      // console.log("isi tokenAccess", tokenAccess);
      let data = {
        users_id: users_id,
        prod_id: prod_id,
        qty: qty,
      };
      let option = {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
      };
      Axios.post(`${API_URL}/transaction/cart`, data, option)
        .then((res) => {
          console.log("isi dari res.data", res.data);
          this.props.CartAction(res.data);
          this.setState({
            message: "Product added to cart",
            openSnack: true,
            alertStatus: "success",
            loading: false,
          });
        })
        .catch((error) => {
          console.error("line 103", error);
          this.setState({
            message: error.response.data.message,
            openSnack: true,
            alertStatus: "error",
            loading: false,
          });
        });
    }
  };

  wishClick = () => {
    if (this.state.wishlist.length) {
      let wish_id = this.state.wishlist[0].wish_id;
      Axios.delete(`${API_URL}/auth/removewish/${this.props.dataUser.id}/${wish_id}`)
        .then((res) => {
          this.setState({
            wishlist: res.data,
            message: 'Removed from wishlist',
            openSnack: true,
            alertStatus: "info",
            loading: false,
          });
          console.log('ini res.data', res.data);
          console.log('ini state wish', this.state.wishlist);
        }).catch((error) => {
          console.error(error);
          this.setState({
            message: error.response.data.message,
            openSnack: true,
            alertStatus: "error",
            loading: false,
          });
        });
    } else {
      let product_id = this.state.product.id;
      let dataInsert = {
        product_id: product_id
      };
      Axios.post(`${API_URL}/auth/addwishlist/${this.props.dataUser.id}`, dataInsert)
        .then((res) => {
          console.log('ini res post', res.data);
          this.setState({
            message: 'Added to wishlist',
            openSnack: true,
            alertStatus: `success`,
            loading: false,
            wishlist: res.data
          });
          console.log('post state.wish', this.state.wishlist);
        }).catch((error) => {
          console.error(error);
          this.setState({
            message: error.response.data.message,
            openSnack: true,
            alertStatus: "error",
            loading: false,
          });
        });
    }
  };

  render() {
    return (
      <div>
        {this.state.loading ? <LoaderComp /> : null}
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
                {currencyFormatter(this.state.product.price).split(",")[0]}
              </div>
              <div className="detail-penjualan">
                <p>125 people buy this product</p>
              </div>
              <hr />
              <div className="detail-ongkir">
                <p>Shipping fees start from Rp16.000</p>
              </div>
              <hr />

              <div className="stockinfo-detailp">
                Stock available &nbsp;
                {this.state.product.quantity > 0
                  ? this.state.product.quantity
                  : 0}
              </div>
            </div>
            <div className="cart-info">
              <h1 className="set-amount">Set amount</h1>
              <div className="detail-quantity">
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
              <div className="detail-price-cart">
                <p
                  style={{
                    fontSize: "14px",
                    marginTop: "10px",
                    display: "flex",
                    fontWeight: 600,
                  }}
                >
                  Stock{" "}
                  {this.state.product.quantity > 0
                    ? this.state.product.quantity
                    : 0}
                </p>
                {
                  currencyFormatter(
                    this.state.product.price * this.state.qty
                  ).split(",")[0]
                }
              </div>
              <div className="detail-button-cart">
                <button onClick={this.addToCart}>
                  <div>
                    <AddIcon style={{ color: "white" }} />
                  </div>
                  <div className="add-tocart">Add to cart</div>
                </button>
              </div>
              {this.props.dataUser.islogin ?
                <div className='wish-product' onClick={this.wishClick}>
                  {this.state.wishlist.length ?
                    <FaHeart style={{ color: '#F50057', fontSize: '18px', marginRight: '5px' }} />
                    :
                    <FaRegHeart style={{ fontSize: '18px', marginRight: '5px' }} />
                  } Wishlist
                </div>
                :
                null
              }
            </div>
          </div>
        </div>
        <AlertAdmin
          openSnack={this.state.openSnack}
          handleSnack={this.handleSnack}
          message={this.state.message}
          status={this.state.alertStatus}
        />
      </div>
    );
  }
}

const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};

export default connect(MaptstatetoProps, { CartAction })(ProductDetail);
