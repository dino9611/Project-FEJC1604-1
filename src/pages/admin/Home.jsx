import React, { Component } from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import { Container } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import { LoginAdminActionThunk } from "../../redux/actions";
import { API_URL, currencyFormatter } from "../../helper";
import { Redirect } from "react-router-dom";
import "../styles/HomeAdmin.css";
import AlertAdmin from '../../components/AlertAdmin';

class HomeAdmin extends Component {
  state = {
    revenue: 0,
    potential: 0,
    startDate: "",
    endDate: "",
    loading: false,
    openSnack: false,
    message: "",
    alertStatus: "",
  };

  componentDidMount() {
    axios
      .get(`${API_URL}/admin/revenue`)
      .then((res) => {
        // console.log('ini revenue', res.data[0].revenue);
        this.setState({ revenue: res.data[0].revenue });
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get(`${API_URL}/admin/potential`)
      .then((res1) => {
        // console.log(res1.data[0]);
        this.setState({ potential: res1.data[0].potentialRevenue });
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(this.props.dataAdmin);
  }

  onDateChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    // console.log(e.target.value);
  };

  handleSnack = () => {
    this.setState({ openSnack: false, message: '', alertStatus: '' });
  };


  onFilterClick = () => {
    if (!this.state.startDate || !this.state.endDate) {
      this.setState({
        message: 'Date must be selected',
        openSnack: true,
        alertStatus: 'info',
        loading: false
      });
    } else {
      axios
        .get(
          `${API_URL}/admin/revenue?startDate=${this.state.startDate}&endDate=${this.state.endDate}`
        )
        .then((res) => {
          // console.log('ini filter', res.data[0]);
          this.setState({ revenue: res.data[0].revenue });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  render() {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Container>
          <div className="kotak-1-pendapatan">
            <div style={{ fontSize: "20px", fontWeight: "600" }}></div>
            <div className="kotak-date">
              <div style={{ marginRight: "50px" }}>
                <div>Start date:</div>
                <input
                  type="date"
                  name="startDate"
                  value={this.state.startDate}
                  onChange={this.onDateChange}
                />
              </div>
              <div style={{ marginRight: "50px" }}>
                <div>End date:</div>
                <input
                  type="date"
                  name="endDate"
                  value={this.state.endDate}
                  onChange={this.onDateChange}
                />
              </div>
              <div style={{ alignSelf: "flex-end" }}>
                <button className="filter-btn" onClick={this.onFilterClick}>
                  Filter
                </button>
              </div>
            </div>
          </div>
          <div className="kotak-2-pendapatan">
            <div className="kotak-revenue">
              <div className="kotak-revenue-1">Revenue</div>
              <div className="kotak-revenue-2">
                {currencyFormatter(this.state.revenue)}
              </div>
            </div>
            <div className="kotak-revenue">
              <div className="kotak-revenue-1">Potential Revenue</div>
              <div className="kotak-revenue-2">
                {currencyFormatter(this.state.potential)}
              </div>
            </div>
          </div>
        </Container>
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

const mapStateToProps = (state) => {
  return {
    dataAdmin: state.Auth,
  };
};

export default connect(mapStateToProps, { LoginAdminActionThunk })(HomeAdmin);
