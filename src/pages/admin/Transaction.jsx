import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  TablePagination,
  Collapse,
  Box,
  InputBase,
  Typography,
  Select,
  MenuItem,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { API_URL, currencyFormatter } from "../../helper";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import LoaderCompAdmin from "../../components/LoaderAdmin";
import Swal from "sweetalert2";
import axios from "axios";
import "../styles/adminTransaction.css";

class Transaction extends Component {
  state = {
    page: 0,
    rowsPerPage: 5,
    transaction: [],
    transactionDetail: [],
    open: false,
    loading: false,
    currentOpen: -1,
    statusTransaction: "",
    monthTo: "",
    monthFrom: "",
    warehouse_id: "",
    totalData: 0,
    orders_id: 0,
    roleAdmin: 0,
  };

  async componentDidUpdate(prevProps, prevState) {
    try {
      if (
        prevState.page != this.state.page ||
        prevState.statusTransaction != this.state.statusTransaction ||
        prevState.rowsPerPage != this.state.rowsPerPage ||
        prevState.orders_id != this.state.orders_id ||
        prevState.monthFrom != this.state.monthFrom ||
        prevState.monthTo != this.state.monthTo ||
        prevState.warehouse_id != this.state.warehouse_id
        // || prevState.transaction != this.state.transaction
      ) {
        this.setState({ loading: true });
        // console.log(prevState.transaction != this.state.transaction)
        let tokenAccess = localStorage.getItem("TA");
        let res = await axios.get(`${API_URL}/admin/transaction`, {
          headers: {
            Authorization: "Bearer " + tokenAccess,
          },
          params: {
            status:
              this.state.statusTransaction === "All"
                ? ""
                : this.state.statusTransaction,
            page: this.state.page,
            rowPerPage: this.state.rowsPerPage,
            monthFrom:
              this.state.monthFrom === "none" ? "" : this.state.monthFrom,
            monthTo: this.state.monthTo === "none" ? "" : this.state.monthTo,
            warehouse_id:
              this.state.warehouse_id == "none" ? "" : this.state.warehouse_id,
          },
        });
        this.setState({
          transaction: res.data.dataTransaction,
          totalData: res.data.totalData,
          loading: false,
        });

        let res2 = await axios.get(`${API_URL}/admin/detail-transaction`, {
          headers: {
            Authorization: "Bearer " + tokenAccess,
          },
          params: {
            orders_id: this.state.orders_id,
          },
        });
        console.log(this.state.orders_id);
        this.setState({
          transactionDetail: res2.data,
          loading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    try {
      let tokenAccess = localStorage.getItem("TA");
      let res = await axios.get(`${API_URL}/admin/transaction`, {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
        params: {
          status: this.state.statusTransaction,
          page: this.state.page,
          rowPerPage: this.state.rowsPerPage,
          monthFrom: this.state.monthFrom,
          monthTo: this.state.monthTo,
          warehouse_id: this.state.warehouse_id,
        },
      });
      this.setState({
        transaction: res.data.dataTransaction,
        totalData: res.data.totalData,
        roleAdmin: res.data.roleAdmin,
      });
      let res2 = await axios.get(`${API_URL}/admin/detail-transaction`, {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
        params: {
          orders_id: this.state.orders_id,
        },
      });
      console.log(this.state.orders_id);
      this.setState({
        transactionDetail: res2.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  onCofirmClick = (row) => {
    let id = row.id;
    let tokenAccess = localStorage.getItem("TA");
    let data = {
      id: id,
    };
    Swal.fire({
      title: "Do you wanna to confirm this transaction?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`${API_URL}/admin/confirm-transaction`, data, {
            headers: {
              Authorization: "Bearer " + tokenAccess,
            },
          })
          .then((res3) => {
            this.setState({ transaction: res3.data });
            // console.log(this.state.page, this.state.rowsPerPage);
          })
          .catch((err) => {
            console.log(err);
          });
        Swal.fire("Confirm!", "The transaction has been confirm.", "success");
      }
    });
  };

  onRejectClick = (row) => {
    let id = row.id;
    let invoice = row.invoice;
    let amount = row.amountTotal;
    let tokenAccess = localStorage.getItem("TA");
    let data = {
      id: id,
    };
    Swal.fire({
      title: `Do you wanna to reject this transaction?`,
      text: `Invoice ${invoice}, Amount ${amount}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, rejected!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`${API_URL}/admin/reject-transaction`, data, {
            headers: {
              Authorization: "Bearer " + tokenAccess,
            },
          })
          .then((res3) => {
            this.setState({ transaction: res3.data });
          })
          .catch((err) => {
            console.log(err);
          });
        Swal.fire("Rejected!", "The transaction has been rejected.", "success");
      }
    });
  };

  handleChangePage = (e, newPage) => {
    this.setState({
      page: newPage,
    });
    // console.log(newPage);
  };

  handleStatus = (e) => {
    console.log(e.target);
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({
      rowsPerPage: e.target.value,
      page: 0,
    });
  };

  handleChange = (e) => {
    this.setState({ statusTransaction: e.target.value });
  };

  handleMonthFrom = (e) => {
    this.setState({ monthFrom: e.target.value });
  };

  handleMonthTo = (e) => {
    this.setState({ monthTo: e.target.value });
  };

  handleWarehouse = (e) => {
    this.setState({ warehouse_id: e.target.value });
  };

  render() {
    let {
      transaction,
      transactionDetail,
      statusTransaction,
      rowsPerPage,
      page,
      open,
      currentOpen,
      monthFrom,
      monthTo,
      warehouse_id,
    } = this.state;

    const columns = [
      { id: "dateTime", label: "DATE", minWidth: 120, align: "left" },
      { id: "invoice", label: "INVOICE", minWidth: 80, align: "left" },
      { id: "name", label: "CUSTOMER", minWidth: 120, align: "left" },
      { id: "status", label: "STATUS", minWidth: 140, align: "left" },
      { id: "amountTotal", label: "AMOUNT", minWidth: 130, align: "left" },
      { id: "warehouse", label: "WAREHOUSE", minWidth: 100, align: "left" },
      { id: "confirm", label: "", minWidth: 20, align: "center" },
      { id: "reject", label: "", minWidth: 20, align: "center" },
      { id: "drop", label: "", minWidth: 30, align: "center" },
    ];

    const columnsSuper = [
      { id: "dateTime", label: "DATE", minWidth: 80, align: "left" },
      { id: "invoice", label: "INVOICE", minWidth: 80, align: "left" },
      { id: "name", label: "CUSTOMER", minWidth: 80, align: "left" },
      { id: "status", label: "STATUS", minWidth: 130, align: "left" },
      { id: "amountTotal", label: "AMOUNT", minWidth: 130, align: "left" },
      { id: "warehouse", label: "WAREHOUSE", minWidth: 50, align: "left" },
      { id: "drop", label: "", minWidth: 30, align: "center" },
    ];

    const detail = [
      { id: "hourTime", label: "HOUR", minWidth: 80, align: "left" },
      { id: "invoice_number", label: "INVOICE", minWidth: 80, align: "left" },
      { id: "productName", label: "PRODUCT", minWidth: 150, align: "left" },
      { id: "category", label: "CATEGORY", minWidth: 100, align: "left" },
      { id: "price", label: "PRICE", minWidth: 130, align: "left" },
      { id: "quantity", label: "QUANTITY", minWidth: 50, align: "left" },
      { id: "amount", label: "TOTAL", minWidth: 130, align: "left" },
    ];

    const StyledTableCell = withStyles(() => ({
      head: {
        background: "none",
        color: "#052c43",
        border: "none",
        padding: 0,
        fontSize: 12,
        paddingLeft: 30,
      },
      body: {
        backgroundColor: "white",
        paddingTop: 14,
        paddingBottom: 0,
        paddingLeft: 30,
        fontSize: 13,
        color: "red",
        border: "none",
      },
    }))(TableCell);

    const StyledTableCell2 = withStyles(() => ({
      head: {
        color: "#535353",
        border: "none",
        padding: 0,
        paddingLeft: 30,
        fontSize: 12,
      },
      body: {
        padding: 0,
        paddingLeft: 30,
        fontSize: 12,
        color: "#052c43",
        border: "none",
      },
    }))(TableCell);

    const StyledTable = withStyles(() => ({
      root: {
        borderCollapse: "separate",
        borderSpacing: "0px 3px",
      },
    }))(Table);

    const BootstrapInput = withStyles(() => ({
      input: {
        position: "relative",
        backgroundColor: "none",
        border: "none",
        fontSize: 14,
        background: "none",
      },
    }))(InputBase);

    transaction.map((val) => {
      if (val.status === "awaiting confirmation") {
        val.status = "Awaiting Confirmation";
      }
      if (val.status === "awaiting payment") {
        val.status = "Awaiting Payment";
      }
      if (val.status === "sending") {
        val.status = "Sending";
      }
      if (val.status === "processed") {
        val.status = "Processed";
      }
      if (val.status === "rejected") {
        val.status = "Rejected";
      }
      if (val.status === "delivered") {
        val.status = "Delivered";
      }
    });

    let arrMap = this.state.roleAdmin == 2 ? columnsSuper : columns;

    return (
      <Fragment>
        {this.state.loading ? <LoaderCompAdmin /> : null}
        <div className="transaction-container">
          <div className="transaction-content">
            <div className="transaction-content-left">
              <p className="transaction-text-1">Transactions</p>
            </div>
            <div className="transaction-content-right">
              <h1 className="transaction-show"> From </h1>
              <Select
                value={monthFrom}
                onChange={this.handleMonthFrom}
                displayEmpty
                style={{
                  width: 140,
                  height: 45,
                  padding: 5,
                  paddingLeft: 20,
                  marginRight: 20,
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: 5,
                }}
                input={<BootstrapInput />}
              >
                <MenuItem value="" disabled>
                  Month
                </MenuItem>
                <MenuItem value="none">
                  <span>None</span>
                </MenuItem>
                <MenuItem value="2021-06-01">
                  <span>June</span>
                </MenuItem>
                <MenuItem value="2021-07-01">
                  <span>July</span>
                </MenuItem>
                <MenuItem value="2021-08-01">
                  <span>August</span>
                </MenuItem>
              </Select>
              <h1 className="transaction-show"> To </h1>
              <Select
                value={monthTo}
                onChange={this.handleMonthTo}
                displayEmpty
                style={{
                  width: 140,
                  height: 45,
                  padding: 5,
                  paddingLeft: 20,
                  marginRight: 20,
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: 5,
                }}
                input={<BootstrapInput />}
              >
                <MenuItem value="" disabled>
                  Month
                </MenuItem>
                <MenuItem value="none">
                  <span>None</span>
                </MenuItem>
                <MenuItem value="2021-07-01">
                  <span>July</span>
                </MenuItem>
                <MenuItem value="2021-08-01">
                  <span>August</span>
                </MenuItem>
                <MenuItem value="2021-09-01">
                  <span>September</span>
                </MenuItem>
              </Select>

              {this.state.roleAdmin == 2 ? (
                <Select
                  value={warehouse_id}
                  onChange={this.handleWarehouse}
                  displayEmpty
                  style={{
                    width: 140,
                    height: 45,
                    padding: 5,
                    paddingLeft: 20,
                    marginRight: 20,
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: 5,
                  }}
                  input={<BootstrapInput />}
                >
                  <MenuItem value="" disabled>
                    Warehouse
                  </MenuItem>
                  <MenuItem value="none">
                    <span>None</span>
                  </MenuItem>
                  <MenuItem value="1">
                    <span>Jakarta</span>
                  </MenuItem>
                  <MenuItem value="2">
                    <span>Bogor</span>
                  </MenuItem>
                  <MenuItem value="3">
                    <span>Depok</span>
                  </MenuItem>
                  <MenuItem value="4">
                    <span>Tanggerang</span>
                  </MenuItem>
                  <MenuItem value="5">
                    <span>Bekasi</span>
                  </MenuItem>
                </Select>
              ) : null}

              <Select
                value={statusTransaction}
                onChange={this.handleChange}
                displayEmpty
                style={{
                  width: 140,
                  height: 45,
                  padding: 5,
                  paddingLeft: 20,
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: 5,
                }}
                input={<BootstrapInput />}
              >
                <MenuItem value="" disabled>
                  Show status
                </MenuItem>
                <MenuItem value="All">
                  <span>All</span>
                </MenuItem>
                <MenuItem value="Processed">
                  <span>Processed</span>
                </MenuItem>
                <MenuItem value="Rejected">
                  <span>Rejected</span>
                </MenuItem>
                <MenuItem value="Awaiting Confirmation">
                  <span>Awaiting Confirmation</span>
                </MenuItem>
                <MenuItem value="Delivered">
                  <span>Delivered</span>
                </MenuItem>
                <MenuItem value="Awaiting Payment">
                  <span>Awaiting Payment</span>
                </MenuItem>
                <MenuItem value="Sending">
                  <span>Sending</span>
                </MenuItem>
              </Select>
            </div>
          </div>
          <TableContainer>
            <StyledTable stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {arrMap.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      <p className="transaction-text-2">{column.label}</p>
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {transaction
                  .map((row, index) => {
                    let idDrop = index;
                    return (
                      <Fragment>
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                        >
                          {arrMap.map((column, index) => {
                            let value = row[column.id];
                            let style1 = row.status === "Processed" && column.id === "status";
                            let style2 = row.status === "Delivered" && column.id === "status";
                            let style3 = row.status === "Awaiting Confirmation" && column.id === "status";
                            let style4 = row.status === "Rejected" && column.id === "status";
                            let style5 = row.status === "Awaiting Payment" && column.id === "status";
                            let style6 = row.status === "Sending" && column.id === "status";
                            return (
                              <StyledTableCell align={column.align}>
                                <p
                                  className="transaction-text-2"
                                  style={{
                                    textAlign: style1 || style3 || style2 || style4 || style5 || style6 ? "center" : "",
                                    fontSize: style3 ? '13px' : "",
                                    backgroundColor: style1 ? "#1859db77" : style2 ? "#4aa96b5e" : style4 ? "#da003773" : style6 ? "#ff77005b" : "none",
                                    color: style1
                                      ? "#185adb"
                                      : style2
                                        ? "#4aa96c"
                                        : style4
                                          ? "#da0037"
                                          : style6
                                            ? "#ff7600"
                                            : column.id === "productName"
                                              ? "#535353"
                                              : "#797979",
                                    fontWeight: style1 || style2 || style3 || style4 || style5 || style6 ? "bold" : 600,
                                  }}
                                >
                                  {column.id === "amountTotal" ? (
                                    (value =
                                      currencyFormatter(value).split(",")[0])
                                  ) : column.id === "drop" ? (
                                    <IconButton
                                      aria-label="expand row"
                                      size="small"
                                      onClick={() => {
                                        this.setState({
                                          open: !open,
                                          currentOpen: idDrop,
                                          orders_id: row.orders_id,
                                        });
                                      }}
                                    >
                                      {open && currentOpen === idDrop ? (
                                        <KeyboardArrowUpIcon />
                                      ) : (
                                        <KeyboardArrowDownIcon />
                                      )}
                                    </IconButton>
                                  ) : column.id === "confirm" &&
                                    row.status === "Awaiting Confirmation" ? (
                                    <IconButton
                                      aria-label="expand row"
                                      size="small"
                                      onClick={() => this.onCofirmClick(row)}
                                    >
                                      <CheckIcon />
                                    </IconButton>
                                  ) : column.id === "reject" &&
                                    row.status === "Awaiting Confirmation" ? (
                                    <IconButton
                                      aria-label="expand row"
                                      size="small"
                                      onClick={() => this.onRejectClick(row)}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  ) : (
                                    value
                                  )}
                                </p>
                              </StyledTableCell>
                            );
                          })}
                        </TableRow>

                        <TableRow>
                          <TableCell
                            style={{
                              paddingRight: 0,
                              paddingLeft: 0,
                              paddingBottom: 0,
                              paddingTop: 0,
                              border: "none",
                            }}
                            colSpan={9}
                          >
                            <Collapse
                              in={open && currentOpen === idDrop}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box
                                style={{
                                  marginBottom: "40px",
                                  marginTop: "3px",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                  style={{
                                    paddingLeft: "30px",
                                    paddingTop: "20px",
                                  }}
                                >
                                  <p
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    DETAIL ORDER
                                  </p>
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                  <TableHead>
                                    <TableRow>
                                      {detail.map((column) => (
                                        <StyledTableCell2
                                          key={column.id}
                                          align={column.align}
                                          style={{ minWidth: column.minWidth }}
                                        >
                                          <p className="transaction-text-2">
                                            {column.label}
                                          </p>
                                        </StyledTableCell2>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {transactionDetail.map(
                                      (rowdetail, index) => {
                                        return (
                                          <Fragment>
                                            <TableRow>
                                              {detail.map((column) => {
                                                let value =
                                                  rowdetail[column.id];
                                                return (
                                                  <StyledTableCell2
                                                    align={column.align}
                                                  >
                                                    {rowdetail.invoice_number ==
                                                      row.invoice
                                                      ? column.id === "price" ||
                                                        column.id === "amount"
                                                        ? (value =
                                                          currencyFormatter(
                                                            value
                                                          ).split(",")[0])
                                                        : value
                                                      : value}
                                                    {/* {value} */}
                                                  </StyledTableCell2>
                                                );
                                              })}
                                            </TableRow>
                                          </Fragment>
                                        );
                                      }
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    );
                  })}
              </TableBody>
            </StyledTable>
          </TableContainer>
          <p>
            <TablePagination
              rowsPerPageOptions={[
                5,
                10,
                { label: "All", value: this.state.totalData },
              ]}
              component="div"
              count={this.state.totalData}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              style={{ color: "rgb(145, 145, 145)", margin: 10 }}
            />
          </p>
        </div>
      </Fragment>
    );
  }
}

export default Transaction;
