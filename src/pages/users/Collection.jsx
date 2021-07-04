import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../components/Header";
import Axios from "axios";
import { Link } from "react-router-dom";
import { BsChevronRight, BsChevronLeft, BsSearch } from "react-icons/bs";
import { API_URL, currencyFormatter } from "../../helper";
import { withStyles } from "@material-ui/core/styles";
import { Select, MenuItem, InputBase } from "@material-ui/core";
import "./../styles/Collection.css";

class Collection extends Component {
  state = {
    products: [],
    page: 1,
    limit: 12,
    totaldata: 0,
    minPage: 0,
    maxPage: 5,
    pageLimit: 5,
    categories: [],
    statusCategory: [],
  };

  componentDidMount() {
    Axios.get(
      `${API_URL}/product/paging?pages=${this.state.page}&limit=${this.state.limit}`
    )
      .then((res) => {
        Axios.get(`${API_URL}/product/category`)
          .then((res1) => {
            this.setState({
              products: res.data.dataProduct,
              totaldata: res.data.totaldata,
              categories: res1.data,
            });
            console.log(this.state.categories);
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
    if (
      this.state.page !== prevstate.page ||
      this.state.statusCategory !== prevstate.statusCategory
    ) {
      Axios.get(
        `${API_URL}/product/paging?pages=${this.state.page}&limit=${this.state.limit}`,
        {
          params: {
            status:
              this.state.statusCategory === "All"
                ? ""
                : this.state.statusCategory,
          },
        }
      )
        .then((res) => {
          this.setState({
            products: res.data.dataProduct,
            totaldata: res.data.totaldata,
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
          className="normal-link-collection"
          to={{ pathname: `/productDetail/${val.id}`, state: { product: val } }}
        >
          <div className="render-prod-collection" key={index}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="render-prod-card">
                <img
                  src={API_URL + val.image}
                  alt={val.name}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="render-prod-info">
                <div className="card-name-content">
                  <p>{val.name}</p>
                  <p>{val.category}</p>
                </div>
                <div className="card-price-content">
                  <p>{currencyFormatter(val.price)}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    });
  };

  renderCategoryFilter = () => {
    return this.state.categories.map((val, index) => {
      return (
        <MenuItem key={index} value={val.category_name}>
          <span>{val.category_name}</span>
        </MenuItem>
      );
    });
  };

  categoryChange = (e) => {
    this.setState({ statusCategory: e.target.value });
  };

  render() {
    const BootstrapInput = withStyles(() => ({
      input: {
        position: "relative",
        backgroundColor: "none",
        border: "none",
        width: "200px",
        fontSize: "1rem",
        color: "#e8e8e8",
        background: "none",
      },
    }))(InputBase);

    return (
      <div>
        <Header />
        <div className="jumbotron-1-collection">
          <div className="page-2-collection">
            <h5 className="page-2-text-1">Our Product</h5>
            <h1 className="page-2-text-2">Furniture Collection</h1>
            <div className="filter-content-collection">
              <div className="totalprod-info-collection">
                <p>Total Products {this.state.totaldata}</p>
              </div>
              <div className="search-content-collection">
                <div className="dropdown-collection">
                  <Select
                    input={<BootstrapInput />}
                    value={this.state.statusCategory}
                    onChange={this.categoryChange}
                    displayEmpty
                    className="history-select-status"
                  >
                    <MenuItem value="" disabled>
                      Choose category
                    </MenuItem>
                    <MenuItem value="All">All Category</MenuItem>
                    {this.renderCategoryFilter()}
                  </Select>
                </div>
                <div className="searchbar-content-collection">
                  <input
                    className="searchbar-collection"
                    type="text"
                    placeholder="Search..."
                  />
                  <BsSearch
                    style={{
                      fontSize: "1.5rem",
                      color: "black",
                      // marginLeft: "4%",
                      color: "grey",
                    }}
                  />
                </div>
              </div>
            </div>
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
