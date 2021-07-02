import React, { Component } from "react";
import SideBarAdmin from "../../components/SideBarAdmin";
import Axios from "axios";
import { API_URL, currencyFormatter } from "./../../helper";
import { Doughnut, defaults, Line, Bar } from "react-chartjs-2";
import "./../styles/Report.css";

defaults.global.legend.position = "bottom";
// defaults.global.legend.align = "start";
// defaults.global.legend.align = "center";

class Report extends Component {
  state = {
    gender: [],
    totalGender: [],
    category: [],
    totalCategory: [],
    revenue: [],
    month: [],
    warehouse: [],
    totalWarehouse: [],
  };

  componentDidMount() {
    Axios.get(`${API_URL}/admin/gender`)
      .then((res) => {
        Axios.get(`${API_URL}/admin/categoryReport`)
          .then((res1) => {
            Axios.get(`${API_URL}/admin/revenueReport`)
              .then((res2) => {
                Axios.get(`${API_URL}/admin/warehouseReport`)
                  .then((res3) => {
                    this.setState({
                      gender: res.data.map((val) => val.gender),
                      totalGender: res.data.map((val) => val.total),
                      category: res1.data.totalCategory,
                      totalCategory: res1.data.dataCategory,
                      revenue: res2.data.map((val) => val.total_revenue / 10e5),
                      month: res2.data.map((val) => val.month_),
                      warehouse: res3.data.map((val) => val.location),
                      totalWarehouse: res3.data.map((val) => val.totalProduct),
                    });
                    console.log(this.state.revenue);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  joinCategory = () => {
    const { category, totalCategory } = this.state;
    let indexCat = [];
    let category_name = this.state.category.map((val) => val.category_name);
    let totalCategory_name = this.state.totalCategory.map(
      (val) => val.category_name
    );
    for (var i = 0; i < totalCategory_name.length; i++) {
      indexCat.push(category_name.indexOf(totalCategory_name[i]));
    }
    for (var j = 0; j < indexCat.length; j++) {
      category[indexCat[j]].total = totalCategory[j].total;
    }
    for (var k = 0; k < category.length; k++) {
      if (!category[k].total) {
        category[k].total = 0;
      }
    }
    return category;
  };

  categoryColor = () => {
    const { category } = this.state;
    let color = [];
    for (var i = 0; i < category.length; i++) {
      color.push("#" + Math.floor(Math.random() * 16777215).toString(16));
    }
    return color;
  };

  genderColor = () => {
    let gender = this.state.gender;
    let color = [];
    for (var i = 0; i < gender.length; i++) {
      color.push("#" + Math.floor(Math.random() * 16777215).toString(16));
    }
    return color;
  };

  render() {
    console.log(this.state.gender);
    return (
      <div className="jumbotron-1-report">
        <SideBarAdmin />
        <div className="jumbotron-1-report-in">
          <div className="report-content">
            <div className="report-gender">
              <div className="report-chart-title-1">
                <p>Category</p>
              </div>
              <hr style={{ width: "100%" }} />
              <div className="chart-container-cat">
                <Doughnut
                  data={{
                    labels: this.joinCategory().map((val) => val.category_name),
                    datasets: [
                      {
                        label: "# of Votes",
                        data: this.joinCategory().map((val) => val.total),
                        backgroundColor: this.categoryColor(),
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    legend: {
                      labels: {
                        boxWidth: 15,
                      },
                    },
                    responsive: true,
                    maintainAspectRatio: true,
                  }}
                />
              </div>
            </div>
            <div className="report-revenue">
              <div className="report-chart-title-2">
                <p>Revenue</p>
              </div>
              <hr style={{ width: "100%" }} />
              <div className="chart-container-revenue">
                <Line
                  data={{
                    labels: this.state.month,
                    datasets: [
                      {
                        data: this.state.revenue,
                        backgroundColor: "rgb(255, 99, 132, 0.7)",
                        borderColor: "rgba(255, 99, 132, 0.2)",
                        borderWidth: 4,
                        pointBorderWidth: 3,
                        pointRadius: 5,
                      },
                    ],
                  }}
                  options={{
                    legend: { display: false },
                    layout: {
                      padding: 10,
                    },
                    scales: {
                      yAxes: [
                        {
                          scaleLabel: {
                            labelString: "revenue in million",
                            display: true,
                          },
                          ticks: {
                            beginAtZero: true,
                          },
                          gridLines: {
                            display: false,
                          },
                        },
                      ],
                      xAxes: [
                        {
                          gridLines: {
                            display: false,
                          },
                        },
                      ],
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="report-content-2">
            <div className="report-gender-2">
              <div className="report-chart-title-3">
                <p>Gender</p>
              </div>
              <hr style={{ width: "100%" }} />
              <div className="chart-container-gender">
                <Doughnut
                  data={{
                    labels: this.state.gender,
                    datasets: [
                      {
                        label: "# of Votes",
                        data: this.state.totalGender,
                        backgroundColor: this.genderColor(),
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    legend: {
                      labels: {
                        boxWidth: 15,
                      },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div className="report-warehouse">
              <div className="report-chart-title-4">
                <p>Warehouse</p>
              </div>
              <hr style={{ width: "100%" }} />
              <div className="chart-container-warehouse">
                <Bar
                  data={{
                    labels: this.state.warehouse,
                    datasets: [
                      {
                        barPercentage: 1,
                        label: "Total sales",
                        data: this.state.totalWarehouse,
                        backgroundColor: "rgb(255, 99, 132)",
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                    },
                    legend: { display: false },
                    layout: { padding: 20 },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Report;
