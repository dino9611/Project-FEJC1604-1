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
  Typography,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputBase,
  Snackbar,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { Alert } from "@material-ui/lab";
import { API_URL, currencyFormatter } from "../../helper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
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

class Processing extends Component {
  state = {
    page: 0,
    rowsPerPage: 5,
    transaction: [],
    transactionDetail: [],
    transactionOrder: [],
    open: false,
    openDialog: false,
    openSnack: false,
    loading: false,
    stockTomuch: false,
    currentOpen: -1,
    productId: 0,
    totalData: 0,
    orders_id: 0,
    indexOrder: 0,
    roleAdmin: 0,
  };

  async componentDidUpdate(prevProps, prevState) {
    try {
      let tokenAccess = localStorage.getItem("TA");
      if (
        prevState.page != this.state.page ||
        prevState.rowsPerPage != this.state.rowsPerPage ||
        prevState.orders_id != this.state.orders_id ||
        prevState.openSnack != this.state.openSnack
      ) {
        this.setState({ loading: true });
        let res = await axios.get(
          `${API_URL}/admin-warehouse-transaction/transaction`,
          {
            headers: {
              Authorization: "Bearer " + tokenAccess,
            },
            params: {
              status: "processed",
              page: this.state.page,
              rowPerPage: this.state.rowsPerPage,
            },
          }
        );
        this.setState({
          transaction: res.data.dataTransaction,
          totalData: res.data.totalData,
          loading: false,
        });

        let res2 = await axios.get(
          `${API_URL}/admin-warehouse-processing/processing-product`,
          {
            headers: {
              Authorization: "Bearer " + tokenAccess,
            },
            params: {
              orders_id: this.state.orders_id,
            },
          }
        );
        this.setState({
          transactionDetail: res2.data,
        });
      } else if (prevState.productId != this.state.productId) {
        let res2 = await axios.get(
          `${API_URL}/admin-warehouse-processing/warehouse-location`,
          {
            headers: {
              Authorization: "Bearer " + tokenAccess,
            },
            params: {
              productId: this.state.productId,
            },
          }
        );
        // untuk nambah propery
        let newData = res2.data.map((val) => {
          return {
            ...val,
            qtyReq: 0,
          };
        });
        this.setState({
          transactionOrder: newData,
        });
        console.log(newData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    try {
      let tokenAccess = localStorage.getItem("TA");
      let res = await axios.get(
        `${API_URL}/admin-warehouse-transaction/transaction`,
        {
          headers: {
            Authorization: "Bearer " + tokenAccess,
          },
          params: {
            status: "processed",
            page: this.state.page,
            rowPerPage: this.state.rowsPerPage,
          },
        }
      );
      this.setState({
        transaction: res.data.dataTransaction,
        totalData: res.data.totalData,
        roleAdmin: res.data.roleAdmin,
      });

      //get location
      let res2 = await axios.get(
        `${API_URL}/admin-warehouse-processing/warehouse-location`,
        {
          headers: {
            Authorization: "Bearer " + tokenAccess,
          },
        }
      );
      console.log(res2.data);
    } catch (error) {
      console.log(error);
    }
  }

  onChangeRequest = (e, index) => {
    let dataNew = this.state.transactionOrder;
    dataNew[index].qtyReq = e.target.value;
    this.setState({
      transactionOrder: dataNew,
    });
  };

  handleChangePage = (e, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({
      rowsPerPage: e.target.value,
      page: 0,
    });
  };

  handleClickOpen = (row, index) => {
    this.setState({
      openDialog: true,
      productId: row.product_id,
      indexOrder: index,
    });
  };

  handleSnack = () => {
    this.setState({ openSnack: false });
  };

  handleClose = () => {
    this.setState({ openDialog: false });
  };

  handleRequest = () => {
    let { transactionOrder, productId, orders_id } = this.state;
    let transactionObj = this.state.transactionDetail[this.state.indexOrder];
    let totalReqQty = transactionOrder.reduce((current, val) => {
      return current + parseInt(val.qtyReq);
    }, 0);

    if (transactionObj.qty === transactionObj.stock + totalReqQty) {
      let tokenAccess = localStorage.getItem("TA");
      axios
        .post(
          `${API_URL}/admin-warehouse-processing/request-stock`,
          {
            productId: productId,
            transactionOrder: transactionOrder,
            orders_id: orders_id,
          },
          {
            headers: {
              Authorization: "Bearer " + tokenAccess,
            },
          }
        )
        .then((res5) => {
          this.setState({
            openDialog: false,
            open: false,
            openSnack: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.setState({stockTomuch: true})
    }
  };

  renderButtonSending = (rowId) => {
    let transactionDetail = this.state.transactionDetail.filter(
      (val) => val.qty > val.stock
    );
    if (transactionDetail.length) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <ButtonBase
            disableRipple
            style={{
              width: "13%",
              backgroundColor: "gray",
              color: "white",
              borderRadius: 0,
              padding: 7,
              marginTop: 34,
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: 0.3,
            }}
          >
            Sending
          </ButtonBase>
          {/* barang belum bisa dikirim */}
        </div>
      );
    } else if (transactionDetail.length === 0) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <ButtonBase
            disableRipple
            style={{
              width: "13%",
              backgroundColor: "#ff7600",
              color: "white",
              borderRadius: 0,
              padding: 7,
              marginTop: 34,
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: 0.3,
            }}
          >
            Sending
          </ButtonBase>
          {/* barang bisa dikirim */}
        </div>
      );
    }
  };

  renderModal = () => {
    let transactionObj = this.state.transactionDetail[this.state.indexOrder];
    if (this.state.transactionDetail.length) {
      if (transactionObj.qty > transactionObj.stock) {
        return (
          <div
            style={{
              padding: 20,
            }}
          >
            <DialogTitle id="form-dialog-title">
              Less requested item!
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.state.stockTomuch ? (
                  <Alert severity="error" style={{ marginBottom: "10px" }}>
                    Stock requests don't mactch your needs.
                  </Alert>
                ) : null}
                <p>
                  Items can't be shipped because there's not enough stock in the
                  warehouse..
                </p>
                <p>
                  <span className="less-request">
                    {transactionObj.productName}
                  </span>
                  only have
                  <span className="less-request"> {transactionObj.stock} </span>
                  stock in warehouse, meanwhile the order quantity is{" "}
                  <span className="less-request">{transactionObj.qty}</span>
                  ... You only need to request{" "}
                  <span className="less-request">
                    {transactionObj.qty - transactionObj.stock}
                  </span>{" "}
                  stock in different warehouse
                </p>
              </DialogContentText>
              {this.state.transactionOrder.map((val, index) => {
                return (
                  <div
                    style={{
                      paddingTop: 15,
                      paddingBottom: 15,
                    }}
                  >
                    <p>
                      Warehouse {val.location} have {val.stock || 0} stock.
                    </p>
                    <InputBase
                      type="number"
                      value={val.qtyReq}
                      className="form-control"
                      onChange={(e) => {
                        this.onChangeRequest(e, index);
                      }}
                      style={{
                        width: "20%",
                      }}
                    />
                  </div>
                );
              })}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose}>Cancel</Button>
              <Button onClick={this.handleRequest} style={{ color: "#da0037" }}>
                Request
              </Button>
            </DialogActions>
          </div>
        );
      } else {
        return (
          <div
            style={{
              padding: 20,
            }}
          >
            <DialogTitle id="form-dialog-title">Items, is Okay!</DialogTitle>
            <DialogContent>
              <DialogContentText>No need action..</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose}>Cancel</Button>
            </DialogActions>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  render() {
    let {
      transaction,
      transactionDetail,
      rowsPerPage,
      page,
      open,
      openDialog,
      openSnack,
      currentOpen,
    } = this.state;

    const Alert = (props) => {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
    };

    const columns = [
      { id: "dateTime", label: "DATE", minWidth: 120, align: "left" },
      { id: "invoice", label: "INVOICE", minWidth: 80, align: "left" },
      { id: "name", label: "CUSTOMER", minWidth: 120, align: "left" },
      { id: "status", label: "STATUS", minWidth: 140, align: "left" },
      { id: "amountTotal", label: "AMOUNT", minWidth: 130, align: "left" },
      { id: "warehouse", label: "WAREHOUSE", minWidth: 100, align: "left" },
      { id: "drop", label: "", minWidth: 30, align: "center" },
    ];

    const detail = [
      { id: "productName", label: "PRODUCT", minWidth: 150, align: "left" },
      { id: "stock", label: "STOCK", minWidth: 130, align: "left" },
      { id: "qty", label: "QUANTITY", minWidth: 50, align: "left" },
      { id: "request", label: "", minWidth: 30, align: "right" },
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

    return (
      <React.Fragment>
        {
          <div className={classes.root}>
            <Snackbar
              open={openSnack}
              autoHideDuration={10000}
              onClose={this.handleSnack}
            >
              <Alert onClose={this.handleSnack} severity="success">
                Request successful!
              </Alert>
            </Snackbar>
          </div>
        }
        {
          <div>
            <Dialog
              open={openDialog}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              {this.renderModal()}
            </Dialog>
          </div>
        }

        <div className="transaction-container">
          <div className="transaction-content">
            <div className="transaction-content-left">
              <p className="transaction-text-1" style={{ marginBottom: "5%" }}>
                Processing
              </p>
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
                        {columns.map((column, index) => {
                          let value = row[column.id];
                          let style1 =
                            row.status === "processed" &&
                            column.id === "status";
                          return (
                            <StyledTableCell align={column.align}>
                              <p
                                className="transaction-text-2"
                                style={{
                                  textAlign: style1 ? "center" : "",
                                  backgroundColor: style1
                                    ? "#1859db77"
                                    : "none",
                                  color: style1
                                    ? "#185adb"
                                    : column.id === "productName"
                                    ? "#535353"
                                    : "#797979",
                                  fontWeight: style1 ? "bold" : 600,
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
                                                {column.id === "request" ? (
                                                  <React.Fragment>
                                                    {rowdetail.on_request ? (
                                                      <div
                                                        style={{
                                                          marginTop: 5,
                                                          marginBottom: 5,
                                                        }}
                                                      >
                                                        <p
                                                          style={{
                                                            fontSize: "13px",
                                                            fontWeight: 600,
                                                          }}
                                                        >
                                                          Requested
                                                        </p>
                                                      </div>
                                                    ) : (
                                                      <IconButton
                                                        onClick={() => {
                                                          this.handleClickOpen(
                                                            rowdetail,
                                                            index
                                                          );
                                                        }}
                                                      >
                                                        {rowdetail.qty >
                                                        rowdetail.stock ? (
                                                          <ErrorOutlineIcon
                                                            style={{
                                                              color: "red",
                                                              fontSize: "20px",
                                                            }}
                                                          />
                                                        ) : (
                                                          <CheckCircleOutlineIcon
                                                            style={{
                                                              color: "green",
                                                              fontSize: "20px",
                                                            }}
                                                          />
                                                        )}
                                                      </IconButton>
                                                    )}
                                                  </React.Fragment>
                                                ) : (
                                                  value
                                                )}
                                              </StyledTableCell2>
                                            );
                                          })}
                                        </TableRow>
                                      </React.Fragment>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                              {this.renderButtonSending(row.id)}
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
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(Processing);
