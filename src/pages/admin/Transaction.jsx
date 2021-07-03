import React, { Component } from "react";
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
  Select,
  MenuItem,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { API_URL, currencyFormatter } from "../../helper";
import axios from "axios";
import "../styles/adminTransaction.css";

class Transaction extends Component {
  state = {
    page: 0,
    rowsPerPage: 8,
    transaction: [],
    arr: [],
    processedArr: [],
    sendingArr: [],
    deliveredArr: [],
    awaitingConfirmationArr: [],
    open: false,
    currentOpen: -1,
    statusTransaction: "",
  };

  async componentDidMount() {
    try {
      let tokenAccess = localStorage.getItem("TA");
      let res = await axios.get(`${API_URL}/admin/list-transaction`, {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
      });
      this.setState({
        transaction: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  handleChangePage = (e, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({
      rowsPerPage: +e.target.value,
      page: 0,
    });
  };

  handleChange = (e) => {
    this.setState({ statusTransaction: e.target.value });
  };

  render() {
    let {
      transaction,
      statusTransaction,
      rowsPerPage,
      page,
      open,
      currentOpen,
      processedArr,
      sendingArr,
      deliveredArr,
      awaitingConfirmationArr,
      arr,
    } = this.state;

    const columns = [
      { id: "dateTime", label: "DATE", minWidth: 80, align: "left" },
      { id: "productName", label: "PRODUCT", minWidth: 180, align: "left" },
      { id: "warehouse", label: "WAREHOUSE", minWidth: 130, align: "left" },
      { id: "status", label: "STATUS", minWidth: 130, align: "left" },
      { id: "amount", label: "AMOUNT", minWidth: 130, align: "left" },
      { id: "drop", label: "", minWidth: 50, align: "center" },
    ];

    const detail = [
      { id: "hourTime", label: "HOUR", minWidth: 80, align: "left" },
      {
        id: "invoice_number",
        label: "INVOICE",
        minWidth: 100,
        align: "left",
      },
      { id: "name", label: "CUSTOMER", minWidth: 150, align: "left" },
      { id: "productName", label: "PRODUCT", minWidth: 150, align: "left" },
      { id: "category", label: "CATEGORY", minWidth: 100, align: "left" },
      { id: "price", label: "PRICE", minWidth: 130, align: "left" },
      { id: "quantity", label: "QUANTITY", minWidth: 50, align: "left" },
      { id: "amount", label: "AMOUNT", minWidth: 130, align: "center" },
    ];

    const StyledTableCell = withStyles(() => ({
      head: {
        background: "none",
        color: "#052c43",
        border: "none",
        padding: 0,
        fontSize: 13,
        paddingLeft: 30,
      },
      body: {
        backgroundColor: "white",
        padding: 2,
        paddingLeft: 30,
        fontSize: 14,
        color: "#052c43",
        border: "none",
      },
    }))(TableCell);

    const StyledTableCell2 = withStyles(() => ({
      head: {
        background: "none",
        color: "#535353",
        border: "none",
        padding: 0,
        paddingTop: 10,
        paddingLeft: 30,
        fontSize: 13,
      },
      body: {
        padding: 0,
        paddingLeft: 30,
        paddingBottom: 20,
        fontSize: 13,
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
      if (val.status === "awaitingConfirmation") {
        val.status = "Awaiting Confirmation";
      }
      if (val.status === "processed") {
        val.status = "Processed";
      }
      if (val.status === "sending") {
        val.status = "Sending";
      }
      if (val.status === "delivered") {
        val.status = "Delivered";
      }
    });

    transaction.map((val) => {
      let minute = val.hourTime.substr(val.hourTime.indexOf(".") + 1);
      let hour = val.hourTime.split(".")[0].toString();
      if (hour.length == 1) {
        val.hourTime = 0 + val.hourTime;
      }
      if (minute.length == 1) {
        val.hourTime = `${hour}.0${minute}`;
      }
    });

    transaction.filter((val) => {
      if (val.status === "Processed") {
        processedArr.push(val);
        arr.push(val);
      } else if (val.status === "Sending") {
        sendingArr.push(val);
        arr.push(val);
      } else if (val.status === "Delivered") {
        deliveredArr.push(val);
        arr.push(val);
      } else if (val.status === "Awaiting Confirmation") {
        awaitingConfirmationArr.push(val);
        arr.push(val);
      }

      if (statusTransaction == "Processed") {
        transaction = processedArr.filter(
          (item, index) => processedArr.indexOf(item) == index
        );
      } else if (this.state.statusTransaction == "Sending") {
        transaction = sendingArr.filter(
          (item, index) => sendingArr.indexOf(item) == index
        );
      } else if (this.state.statusTransaction == "Delivered") {
        transaction = deliveredArr.filter(
          (item, index) => deliveredArr.indexOf(item) == index
        );
      } else if (this.state.statusTransaction == "Awaiting Confirmation") {
        transaction = awaitingConfirmationArr.filter(
          (item, index) => awaitingConfirmationArr.indexOf(item) == index
        );
      } else {
        transaction = arr.filter((item, index) => arr.indexOf(item) == index);
      }
    });

    return (
      <div className="transaction-container">
        <div className="transaction-content">
          <div className="transaction-content-left">
            <p className="transaction-text-1">Transaction</p>
          </div>
          <div className="transaction-content-right">
            <h1 className="transaction-show"></h1>
            <Select
              value={statusTransaction}
              onChange={this.handleChange}
              displayEmpty
              style={{
                width: 150,
                height: 35,
                padding: 5,
                paddingLeft: 20,
                backgroundColor: "white",
                border: "none",
                borderRadius: 50,
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
              <MenuItem value="Sending">
                <span>Sending</span>
              </MenuItem>
              <MenuItem value="Awaiting Confirmation">
                <span>Awaiting Confirmation</span>
              </MenuItem>
              <MenuItem value="Delivered">
                <span>Delivered</span>
              </MenuItem>
            </Select>
          </div>
        </div>
        <TableContainer>
          <StyledTable stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
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
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  let idDrop = index;
                  return (
                    <React.Fragment>
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        {columns.map((column, index) => {
                          let value = row[column.id];
                          return (
                            <StyledTableCell align={column.align}>
                              <p
                                className="transaction-text-2"
                                style={{
                                  color:
                                    row.status === "Processed" &&
                                      column.id === "status"
                                      ? "blue"
                                      : row.status === "Delivered" &&
                                        column.id === "status"
                                        ? "green"
                                        : row.status ===
                                          "Awaiting Confirmation" &&
                                          column.id === "status"
                                          ? "#5a5a5a"
                                          : row.status === "Sending" &&
                                            column.id === "status"
                                            ? "orange"
                                            : column.id === "productName"
                                              ? "#535353"
                                              : "#797979",
                                  fontWeight:
                                    row.status === "Processed" &&
                                      column.id === "status"
                                      ? "bold"
                                      : row.status === "Delivered" &&
                                        column.id === "status"
                                        ? "bold"
                                        : row.status ===
                                          "Awaiting Confirmation" &&
                                          column.id === "status"
                                          ? "bold"
                                          : row.status === "Sending" &&
                                            column.id === "status"
                                            ? "bold"
                                            : 600,
                                }}
                              >
                                {column.id === "amount" ? (
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
                                      });
                                    }}
                                  >
                                    {open && currentOpen === idDrop ? (
                                      <KeyboardArrowUpIcon />
                                    ) : (
                                      <KeyboardArrowDownIcon />
                                    )}
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
                          colSpan={6}
                        >
                          <Collapse
                            in={open && currentOpen === idDrop}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box style={{ backgroundColor: "white", marginBottom: '3px', marginTop: "3px" }}>

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
                                  {detail.map((column) => {
                                    let value = row[column.id];
                                    return (
                                      <StyledTableCell2 align={column.align}>
                                        <p>
                                          {column.id === "amount"
                                            ? (value =
                                              currencyFormatter(value).split(
                                                ","
                                              )[0])
                                            : column.id == "price"
                                              ? (value =
                                                currencyFormatter(value).split(
                                                  ","
                                                )[0])
                                              : value}
                                        </p>
                                      </StyledTableCell2>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
            </TableBody>
          </StyledTable>
        </TableContainer>
        <p>
          <TablePagination
            rowsPerPageOptions={[
              8,
              13,
              15,
              { label: "All", value: transaction.length },
            ]}
            component="div"
            count={transaction.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            style={{ color: "rgb(145, 145, 145)", margin: 10 }}
          />
        </p>
      </div>
    );
  }
}

export default Transaction;
