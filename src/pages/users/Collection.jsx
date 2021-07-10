import React, { Component } from "react";
import Header from "../../components/Header";
import Axios from "axios";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { API_URL, currencyFormatter } from "../../helper";
import { Select, MenuItem, InputBase } from "@material-ui/core";
import Carousel from "./../../components/Carousel";
import { withStyles } from "@material-ui/core/styles";
import { Pagination, PaginationItem } from "@material-ui/lab";
import { styles } from "./../../components/PaginationStyle";
import Empty from "./../../images/history-empty.svg";
import NoImg from "./../../images/no-image.png";
import Footer from "./../../components/Footer";
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
    sortPrice: [],
    searchInput: "",
  };

  componentDidMount() {
    Axios.get(`${API_URL}/product/paging`, {
      params: { pages: this.state.page, limit: this.state.limit },
    })
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
      this.state.statusCategory !== prevstate.statusCategory ||
      this.state.searchInput !== prevstate.searchInput ||
      this.state.sortPrice !== prevstate.sortPrice
    ) {
      Axios.get(`${API_URL}/product/paging`, {
        params: {
          pages: this.state.page,
          limit: this.state.limit,
          status:
            this.state.statusCategory === "All"
              ? ""
              : this.state.statusCategory,
          search: this.state.searchInput,
          price: this.state.sortPrice === "All" ? "" : this.state.sortPrice,
        },
      })
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

  searchChange = (e) => {
    this.setState({ searchInput: e.target.value });
  };

  priceChange = (e) => {
    this.setState({ sortPrice: e.target.value });
  };

  handleChangePage = (e, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  render() {
    const { classes } = this.props;
    const BootstrapInput = withStyles(() => ({
      input: {
        position: "relative",
        backgroundColor: "none",
        border: "none",
        width: "150px",
        fontSize: "1rem",
        color: "gainsboro",
        background: "none",
      },
    }))(InputBase);

    return (
      <div>
        <Header />
        <Carousel />
        <div className="jumbotron-1-collection">
          <div className="page-2-collection">
            <div
              style={{
                width: "87.5%",
                height: "1px",
                backgroundColor: "gainsboro",
                marginBottom: "2%",
              }}
            ></div>
            <div className="filter-content-collection">
              <div className="totalprod-info-collection">
                <p>Total Products {this.state.totaldata}</p>
              </div>
              <div className="search-content-collection">
                <div className="dropdown-collection">
                  <Select
                    input={<BootstrapInput />}
                    value={this.state.sortPrice}
                    onChange={this.priceChange}
                    displayEmpty
                    className="history-select-status"
                  >
                    <MenuItem value="" disabled>
                      Sort price
                    </MenuItem>
                    <MenuItem value="All">All Price</MenuItem>
                    <MenuItem value="asc">Lowest - Highest</MenuItem>
                    <MenuItem value="desc">Highest - Lowest</MenuItem>
                  </Select>
                </div>
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
                    placeholder="Search product name"
                    value={this.state.searchInput}
                    onChange={this.searchChange}
                  />
                  <div className="search-logo-collection">
                    <FiSearch
                      style={{
                        fontSize: "1.2rem",
                        color: "black",
                        height: "100%",
                        color: "grey",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-collection-jumbo">
              {!this.state.products.length ? (
                <div className="card-empty-collection">
                  <img src={Empty} alt="" />
                  <div className="empty-collection-text">
                    <p>No Results Found</p>
                    {this.state.searchInput ? (
                      <p>
                        We couldn't find a match for "{this.state.searchInput}".
                        Please try another search.
                      </p>
                    ) : (
                      <p>
                        We couldn't find a match for this category. Please try
                        another search.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card-content-collection">
                  {this.renderProducts()}
                </div>
              )}
            </div>
            <div>
              <Pagination
                count={Math.ceil(this.state.totaldata / this.state.limit)}
                variant="outlined"
                shape="rounded"
                size="large"
                defaultPage={this.state.page}
                onChange={this.handleChangePage}
                classes={{ ul: classes.ul }}
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    classes={{
                      selected: classes.selected,
                      color: classes.color,
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(Collection);
