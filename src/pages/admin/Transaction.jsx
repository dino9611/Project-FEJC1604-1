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
  Typography,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { IconButton } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ImageIcon from "@material-ui/icons/Image";
import { API_URL, currencyFormatter } from "../../helper";
import axios from "axios";
import "../styles/adminTransaction.css";

const useStyles = (theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
});

class Transaction extends Component {
  state = {
    page: 0,
    rowsPerPage: 10,
    transaction: [],
    transactionDetail: [],
    open: false,
    openDialogConfirm: false,
    openDialogRejected: false,
    openDialogBukti: false,
    openSnack: false,
    openSnackRejected: false,
    loading: false,
    currentOpen: -1,
    statusTransaction: "",
    monthTo: "",
    monthFrom: "",
    warehouse_id: "",
    totalData: 0,
    orders_id: 0,
    roleAdmin: 0,
    confirmOrRejectedId: 0,
    bukti: "",
  };

  async componentDidUpdate(prevProps, prevState) {
    try {
      if (
        prevState.page !== this.state.page ||
        prevState.statusTransaction !== this.state.statusTransaction ||
        prevState.rowsPerPage !== this.state.rowsPerPage ||
        prevState.orders_id !== this.state.orders_id ||
        prevState.monthFrom !== this.state.monthFrom ||
        prevState.monthTo !== this.state.monthTo ||
        prevState.warehouse_id !== this.state.warehouse_id ||
        prevState.openSnackRejected !== this.state.openSnackRejected ||
        prevState.openSnack !== this.state.openSnack
      ) {
        this.setState({ loading: true });
        let tokenAccess = localStorage.getItem("TA");
        let getTransactionRow = await axios.get(
          `${API_URL}/admin-warehouse-transaction/transaction`,
          {
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
                this.state.warehouse_id == "none"
                  ? ""
                  : this.state.warehouse_id,
            },
          }
        );
        this.setState({
          transaction: getTransactionRow.data.dataTransaction,
          totalData: getTransactionRow.data.totalData,
          loading: false,
        });

        let getDetailTransactionRow = await axios.get(
          `${API_URL}/admin-warehouse-transaction/detail-transaction`,
          {
            headers: {
              Authorization: "Bearer " + tokenAccess,
            },
            params: {
              orders_id: this.state.orders_id,
            },
          }
        );
        console.log(this.state.orders_id);
        this.setState({
          transactionDetail: getDetailTransactionRow.data,
          loading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    try {
      const {
        statusTransaction,
        page,
        rowsPerPage,
        monthFrom,
        monthTo,
        warehouse_id,
      } = this.state;
      let tokenAccess = localStorage.getItem("TA");
      let getTransactionRow = await axios.get(
        `${API_URL}/admin-warehouse-transaction/transaction`,
        {
          headers: {
            Authorization: "Bearer " + tokenAccess,
          },
          params: {
            status: statusTransaction,
            page: page,
            rowPerPage: rowsPerPage,
            monthFrom: monthFrom,
            monthTo: monthTo,
            warehouse_id: warehouse_id,
          },
        }
      );
      this.setState({
        transaction: getTransactionRow.data.dataTransaction,
        totalData: getTransactionRow.data.totalData,
        roleAdmin: getTransactionRow.data.roleAdmin,
        bukti: getTransactionRow.data.bukti,
      });
    } catch (error) {
      console.log(error);
    }
  }

  handleConfirm = (row) => {
    this.setState({
      openDialogConfirm: true,
      confirmOrRejectedId: row.id,
    });
  };

  handleRejected = (row) => {
    this.setState({
      openDialogRejected: true,
      confirmOrRejectedId: row.id,
    });
  };

  handleShowProof = (row) => {
    this.setState({ openDialogBukti: true, bukti: row.bukti });
  };

  onCofirmClick = () => {
    const { confirmOrRejectedId } = this.state;
    let tokenAccess = localStorage.getItem("TA");
    let data = {
      id: confirmOrRejectedId,
    };
    axios
      .put(`${API_URL}/admin-warehouse-transaction/confirm-transaction`, data, {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
      })
      .then((res3) => {
        this.setState({
          openDialogConfirm: false,
          openSnack: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onRejectClick = (row) => {
    const { confirmOrRejectedId } = this.state;
    let tokenAccess = localStorage.getItem("TA");
    let data = {
      id: confirmOrRejectedId,
    };
    axios
      .put(`${API_URL}/admin-warehouse-transaction/reject-transaction`, data, {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
      })
      .then((res3) => {
        this.setState({
          openDialogRejected: false,
          openSnackRejected: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleChangePage = (e, newPage) => {
    this.setState({
      page: newPage,
    });
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

  handleDialogBukti = () => {
    this.setState({ openDialogBukti: false });
  };

  handleDialogCofirm = () => {
    this.setState({ openDialogConfirm: false });
  };

  handleDialogRejected = () => {
    this.setState({ openDialogRejected: false });
  };

  handleSnack = () => {
    this.setState({ openSnack: false });
  };

  handleSnackRejected = () => {
    this.setState({ openSnackRejected: false });
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
      openDialogConfirm,
      openDialogRejected,
      openSnack,
      openSnackRejected,
      openDialogBukti,
      currentOpen,
      monthFrom,
      monthTo,
      warehouse_id,
    } = this.state;

    const Alert = (props) => {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
    };

    const columns = [
      { id: "dateTime", label: "DATE", minWidth: 130, align: "left" },
      { id: "invoice", label: "INVOICE", minWidth: 130, align: "left" },
      { id: "name", label: "CUSTOMER", minWidth: 130, align: "left" },
      { id: "status", label: "STATUS", minWidth: 100, align: "left" },
      { id: "amountTotal", label: "AMOUNT", minWidth: 130, align: "left" },
      { id: "confirm", label: "", minWidth: 10, align: "right" },
      { id: "reject", label: "", minWidth: 10, align: "right" },
      {
        id: "showBukti",
        minWidth: 10,
        label: "",
        align: "right",
      },
      { id: "drop", label: "", minWidth: 10, align: "right" },
    ];

    const columnsSuper = [
      { id: "dateTime", label: "DATE", minWidth: 130, align: "left" },
      { id: "invoice", label: "INVOICE", minWidth: 130, align: "left" },
      { id: "name", label: "CUSTOMER", minWidth: 100, align: "left" },
      { id: "status", label: "STATUS", minWidth: 80, align: "left" },
      { id: "amountTotal", label: "AMOUNT", minWidth: 130, align: "left" },
      { id: "warehouse", label: "WAREHOUSE", minWidth: 50, align: "left" },
      { id: "showBukti", minWidth: 10, label: "", align: "right" },
      { id: "drop", label: "", minWidth: 30, align: "center" },
    ];

    const detail = [
      { id: "hourTime", label: "HOUR", minWidth: 80, align: "left" },
      { id: "productName", label: "PRODUCT", minWidth: 150, align: "left" },
      { id: "category", label: "CATEGORY", minWidth: 100, align: "left" },
      { id: "price", label: "PRICE", minWidth: 130, align: "left" },
      { id: "quantity", label: "QUANTITY", minWidth: 50, align: "left" },
      { id: "amount", label: "TOTAL", minWidth: 130, align: "left" },
    ];

    const { classes } = this.props;

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

    let arrMap = this.state.roleAdmin == 2 ? columnsSuper : columns;

    return (
      <React.Fragment>
        {
          <div>
            <Dialog
              open={openDialogBukti}
              onClose={this.handleDialogBukti}
              aria-labelledby="form-dialog-title"
            >
              <DialogContent>
                <img
                  src={API_URL + this.state.bukti}
                  alt="bukti-pembayaran"
                  width="100%"
                  height="auto"
                />
              </DialogContent>
            </Dialog>
          </div>
        }
        {
          <div className={classes.root}>
            <Snackbar
              open={openSnack}
              autoHideDuration={10000}
              onClose={this.handleSnack}
            >
              <Alert onClose={this.handleSnack} severity="success">
                Confirmation is successful!
              </Alert>
            </Snackbar>
          </div>
        }
        {
          <div className={classes.root}>
            <Snackbar
              open={openSnackRejected}
              autoHideDuration={10000}
              onClose={this.handleSnackRejected}
            >
              <Alert onClose={this.handleSnackRejected} severity="info">
                Transaction has been rejected!
              </Alert>
            </Snackbar>
          </div>
        }
        {
          <div>
            <Dialog
              open={openDialogConfirm}
              onClose={this.handleDialogCofirm}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Do you want to confirm this transaction?
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  The transaction will be entered into the processing component
                  and checked first wheter the stock in warehouse can reach
                  customer requests, and after tha the next process will take
                  place.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.onCofirmClick}
                  style={{ color: "#4aa96c" }}
                >
                  Confirm
                </Button>
                <Button onClick={this.handleDialogCofirm}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </div>
        }
        {
          <div>
            <Dialog
              open={openDialogRejected}
              onClose={this.handleRejected}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Do you want to reject this transaction?
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  If the transaction is rejected then the transaction can't be
                  resumed, but can still be accessed on the transaction
                  component.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.onRejectClick}
                  style={{ color: "#da0037" }}
                >
                  Reject
                </Button>
                <Button onClick={this.handleDialogRejected}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </div>
        }
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
                <MenuItem value="processed">
                  <span>processed</span>
                </MenuItem>
                <MenuItem value="rejected">
                  <span>rejected</span>
                </MenuItem>
                <MenuItem value="awaiting confirmation">
                  <span>awaiting confirmation</span>
                </MenuItem>
                <MenuItem value="delivered">
                  <span>delivered</span>
                </MenuItem>
                <MenuItem value="awaiting payment">
                  <span>awaiting payment</span>
                </MenuItem>
                <MenuItem value="sending">
                  <span>sending</span>
                </MenuItem>
              </Select>
            </div>
          </div>
          <TableContainer>
            <StyledTable stickyHeader aria-label="sticky table">
              <TableHead>
                {transaction.length == 0 ? (
                  <div
                    style={{
                      margin: 20,
                    }}
                  >
                    <p style={{ fontSize: "14px" }}>
                      Table is empty.. no transaction yet on this section.
                    </p>
                  </div>
                ) : (
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
                )}
              </TableHead>
              <TableBody>
                {transaction.map((row, index) => {
                  let idDrop = index;
                  return (
                    <React.Fragment>
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        {arrMap.map((column, index) => {
                          let value = row[column.id];
                          let style1 =
                            row.status === "processed" &&
                            column.id === "status";
                          let style2 =
                            row.status === "delivered" &&
                            column.id === "status";
                          let style3 =
                            row.status === "awaiting confirmation" &&
                            column.id === "status";
                          let style4 =
                            row.status === "rejected" && column.id === "status";
                          let style5 =
                            row.status === "awaiting payment" &&
                            column.id === "status";
                          let style6 =
                            row.status === "sending" && column.id === "status";
                          return (
                            <StyledTableCell align={column.align}>
                              <p
                                className="transaction-text-2"
                                style={{
                                  textAlign:
                                    style1 ||
                                    style3 ||
                                    style2 ||
                                    style4 ||
                                    style5 ||
                                    style6
                                      ? "center"
                                      : "",
                                  fontSize: style3
                                    ? "12px"
                                    : column.id === "dateTime"
                                    ? "12px"
                                    : column.id === "invoice"
                                    ? "12px"
                                    : "",
                                  backgroundColor: style1
                                    ? "#1859db77"
                                    : style2
                                    ? "#4aa96b5e"
                                    : style4
                                    ? "#da003773"
                                    : style6
                                    ? "#ff77005b"
                                    : "none",
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
                                  fontWeight:
                                    style1 ||
                                    style2 ||
                                    style3 ||
                                    style4 ||
                                    style5 ||
                                    style6
                                      ? "bold"
                                      : 600,
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
                                  row.status === "awaiting confirmation" ? (
                                  <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => this.handleConfirm(row)}
                                    style={{
                                      color: "#4aa96c",
                                    }}
                                  >
                                    <CheckIcon style={{ fontSize: "19px" }} />
                                  </IconButton>
                                ) : column.id === "reject" &&
                                  row.status === "awaiting confirmation" ? (
                                  <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => this.handleRejected(row)}
                                    style={{
                                      color: "#da0037",
                                    }}
                                  >
                                    <CloseIcon style={{ fontSize: "19px" }} />
                                  </IconButton>
                                ) : column.id === "showBukti" ? (
                                  <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => this.handleShowProof(row)}
                                    style={{
                                      color:
                                        row.status === "awaiting confirmation"
                                          ? "#4aa96c"
                                          : null,
                                    }}
                                  >
                                    <ImageIcon style={{ fontSize: "19px" }} />
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
                          colSpan={10}
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
                                  paddingBottom: "10px",
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
                                  {transactionDetail.map((rowdetail, index) => {
                                    return (
                                      <React.Fragment>
                                        <TableRow>
                                          {detail.map((column) => {
                                            let value = rowdetail[column.id];
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
                                                  : "loading.."}
                                                {/* {value} */}
                                              </StyledTableCell2>
                                            );
                                          })}
                                        </TableRow>
                                      </React.Fragment>
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
                10,
                15,
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
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(Transaction);
