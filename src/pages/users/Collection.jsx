import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../components/Header";
import Axios from "axios";
import ParallaxImg from "../../images/parallax.jpg";
import { Parallax } from "react-parallax";
import { Link } from "react-router-dom";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { API_URL, currencyFormatter } from "../../helper";
import "../styles/Collection.css";

class Collection extends Component {
  state = {
    products: [],
    page: 1,
    limit: 12,
    totaldata: 0,
    minPage: 0,
    maxPage: 5,
    pageLimit: 5,
  };

  componentDidMount() {
    Axios.get(`${API_URL}/product/all`)
      .then((res) => {
        Axios.get(
          `${API_URL}/product/paging?pages=${this.state.page}&limit=${this.state.limit}`
        )
          .then((res1) => {
            this.setState({ products: res1.data, totaldata: res.data.length });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate(prevprops, prevstate) {
    if (this.state.page !== prevstate.page) {
      Axios.get(
        `${API_URL}/product/paging?pages=${this.state.page}&limit=${this.state.limit}`
      )
        .then((res) => {
          this.setState({
            products: res.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  nextButton = () => {
    const { page, maxPage, minPage, pageLimit } = this.state;
    this.setState({ page: page + 1 });
    if (page + 1 > maxPage) {
      this.setState({ maxPage: maxPage + pageLimit });
      this.setState({ minPage: minPage + pageLimit });
    }
  };

  prevButton = () => {
    const { page, maxPage, minPage, pageLimit } = this.state;
    this.setState({ page: page - 1 });
    if ((page - 1) % pageLimit == 0) {
      this.setState({ maxPage: maxPage - pageLimit });
      this.setState({ minPage: minPage - pageLimit });
    }
  };

  renderTotalPage = () => {
    let { limit, totaldata, page, maxPage, minPage } = this.state;
    let panjang = Math.ceil(totaldata / limit);
    let paging = [];
    for (let i = 1; i <= panjang; i++) {
      paging.push(i);
    }
    let renderPageNumber = paging.map((number) => {
      if (number < maxPage + 1 && number > minPage) {
        return (
          <li
            key={number}
            id={number}
            onClick={() => this.setState({ page: number })}
            className={page == number ? "active" : null}
          >
            {number}
          </li>
        );
      } else {
        return null;
      }
    });
    return renderPageNumber;
  };

  renderProducts = () => {
    return this.state.products.map((val, index) => {
      return (
        <Link
          to={{ pathname: `/productDetail/${val.id}`, state: { product: val } }}
        >
          <div style={{ display: "flex" }} key={index}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="render-prod-card">
                <img
                  src={API_URL + val.image}
                  alt={val.name}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="render-prod-info">
                <div>
                  <p className="card-name-text">{val.name}</p>
                  <p className="card-category-text">{val.category}</p>
                </div>
                <div className="card-price-content">
                  <p className="card-price-text">
                    {currencyFormatter(val.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    });
  };

  render() {
    return (
      <div>
        <Parallax bgImage={ParallaxImg} strength={110}>
          <Header />
          <div className="parallax">
            <div className="title">Our Collection</div>
          </div>
        </Parallax>
        <div className="page-2">
          <h5 className="page-2-text-1">Our Product</h5>
          <h1 className="page-2-text-2">Furniture Collection</h1>
          <div className="card-content">{this.renderProducts()}</div>
          <div className="pagination-content">
            <ul className="page-number">
              <li>
                <button
                  disabled={this.state.page == 1 ? true : false}
                  onClick={() => this.prevButton()}
                >
                  <BsChevronLeft
                    style={{ fontSize: "20px", color: "#052c43" }}
                  />
                </button>
              </li>
              {this.renderTotalPage()}
              <li>
                <button
                  disabled={
                    this.state.page ==
                      Math.ceil(this.state.totaldata / this.state.limit)
                      ? true
                      : false
                  }
                  onClick={() => this.nextButton()}
                >
                  <BsChevronRight
                    style={{ fontSize: "20px", color: "#052c43" }}
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-content">
          <div className="footer-1"></div>
          <div className="footer-2"></div>
        </div>
      </div>
    );
  }
}

const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};

export default connect(MaptstatetoProps)(Collection);
