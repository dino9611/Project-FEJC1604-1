import React, { Component } from "react";
import Header from "../../components/Header";
import Axios from "axios";
import { API_URL, currencyFormatter } from "../../helper";
import { Link } from "react-router-dom";
import ChairHome from "../../images/chair-home.jpg";
import Deal from "../../images/great-deal.png";
import Design from "../../images/great-design.png";
import Minimalist from "../../images/minimalist.png";
import Support from "../../images/support.png";
import Footer from "./../../components/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./../styles/Home.css";

class Home extends Component {
  state = {
    page: 1,
    limit: 10,
    products: [],
    cardText:
      "Far far away, behind the word mountains, far from the countries Vokalia.",
  };

  componentDidMount() {
    Axios.get(`${API_URL}/product/paging`, {
      params: { pages: this.state.page, limit: this.state.limit },
    })
      .then((res) => {
        this.setState({
          products: res.data.dataProduct,
        });
        console.log(this.state.products);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderProducts = () => {
    return this.state.products.map((val, index) => {
      return (
        <Link
          className="normal-link-collection"
          to={{ pathname: `/productDetail/${val.id}`, state: { product: val } }}
        >
          <div className="render-prod-home" key={index}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="render-prod-card-home">
                <img
                  src={API_URL + val.image}
                  alt={val.name}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="render-prod-info-home">
                <div className="card-name-content-home">
                  <p>{val.name}</p>
                  <p>{val.category}</p>
                </div>
                <div className="card-price-content-home">
                  <p>{currencyFormatter(val.price).split(",")[0]}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    });
  };

  render() {
    const settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "10px",
      slidesToShow: 5,
      speed: 500,
    };
    return (
      <div className="home-content">
        <div className="jumbotron-one-home">
          <Header />
          <div className="left-content-home">
            <div className="inside-left-content-home">
              <h1 className="fournir-text-1-home">Best Design of</h1>
              <h1 className="fournir-text-2-home">Furniture Collections</h1>
              <h5 className="fournir-text-3-home">
                A small river named Duden flows by their place and supplies it
                with the necessary regelialia.
              </h5>
              <Link to="/collection" className="normal-link-home">
                <div className="btn-collection-home">See Collection</div>
              </Link>
            </div>
          </div>
          <div className="right-content-home">
            <img className="chair-home" src={ChairHome} />
          </div>
        </div>
        <div className="jumbotron-two-home">
          <div className="card-content-home">
            <div className="bg-image-home">
              <img className="card-img" src={Deal} alt="Deal" />
            </div>
            <div className="card-judul-home">Amazing Deals</div>
            <div className="card-text-home">{this.state.cardText}</div>
          </div>
          <div className="card-content-home">
            <div className="bg-image-home">
              <img className="card-img" src={Design} alt="Deal" />
            </div>
            <div className="card-judul-home">Quality Furniture</div>
            <div className="card-text-home">{this.state.cardText}</div>
          </div>
          <div className="card-content-home">
            <div className="bg-image-home">
              <img className="card-img" src={Minimalist} alt="Deal" />
            </div>
            <div className="card-judul-home">Modern Design</div>
            <div className="card-text-home">{this.state.cardText}</div>
          </div>
          <div className="card-content-home">
            <div className="bg-image-home">
              <img className="card-img" src={Support} alt="Deal" />
            </div>
            <div className="card-judul-home">Best Support</div>
            <div className="card-text-home">{this.state.cardText}</div>
          </div>
        </div>
        <div className="jumbotron-three-home">
          <h5 className="three-one-home">Our Collection</h5>
          <h1 className="three-two-home">Furniture Collection</h1>
          <div className="slider-content-home">
            <Slider {...settings} autoplay className="slider-inside-home">
              {this.renderProducts()}
            </Slider>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Home;
