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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { API_URL } from "../../helper";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import CloseIcon from "@material-ui/icons/Close";
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

class RequestStock extends Component {
  state = {
    request_list: [],
    page: 0,
    rowsPerPage: 5,
    totalData: 0,
    acceptProductId: 0,
    rejectProductId: 0,
    openDialogAccept: false,
    openDialogReject: false,
    openSnack: false,
    openSnackReject: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    try {
      if (
        prevState.page != this.state.page ||
        prevState.rowsPerPage != this.state.rowsPerPage ||
        prevState.openSnack != this.state.openSnack ||
        prevState.openSnackReject != this.state.openSnackReject
      ) {
        let tokenAccess = localStorage.getItem("TA");
        let res = await axios.get(
          `${API_URL}/admin-warehouse-request/request-log`,
          {
            headers: {
              Authorization: "Bearer " + tokenAccess,
            },
            params: {
              page: this.state.page,
              rowPerPage: this.state.rowsPerPage,
            },
          }
        );
        this.setState({
          request_list: res.data.dataRequest,
          totalData: res.data.totalData,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    try {
      let tokenAccess = localStorage.getItem("TA");
      let res = await axios.get(
        `${API_URL}/admin-warehouse-request/request-log`,
        {
          headers: {
            Authorization: "Bearer " + tokenAccess,
          },
          params: {
            page: this.state.page,
            rowPerPage: this.state.rowsPerPage,
          },
        }
      );
      this.setState({
        request_list: res.data.dataRequest,
        totalData: res.data.totalData,
      });
    } catch (error) {
      console.log(error);
    }
  }

  onAcceptClick = () => {
    const { acceptProductId } = this.state;
    let tokenAccess = localStorage.getItem("TA");
    let data = {
      id: acceptProductId,
      request_list: this.state.request_list,
    };
    axios
      .post(`${API_URL}/admin-warehouse-request/accept-request`, data, {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
      })
      .then((res) => {
        this.setState({
          openDialogAccept: false,
          openSnack: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onRejectClick = () => {
    const { rejectProductId } = this.state;
    let tokenAccess = localStorage.getItem("TA");
    let data = {
      id: rejectProductId,
      request_list: this.state.request_list,
    };
    axios
      .post(`${API_URL}/admin-warehouse-request/reject-request`, data, {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
      })
      .then((res) => {
        this.setState({
          openDialogReject: false,
          openSnackReject: true,
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

  handleChangeRowsPerPage = (e) => {
    this.setState({
      rowsPerPage: e.target.value,
      page: 0,
    });
  };

  handleSnack = () => {
    this.setState({ openSnack: false });
  };

  handleSnackReject = () => {
    this.setState({ openSnackReject: false });
  };

  handleAccepted = (row) => {
    this.setState({
      openDialogAccept: true,
      acceptProductId: row.products_id,
    });
  };

  handleRejectedReq = (row) => {
    this.setState({
      openDialogReject: true,
      rejectProductId: row.products_id,
    });
  };

  handleDialogAccepted = () => {
    this.setState({ openDialogAccept: false });
  };

  handleDialogRejected = () => {
    this.setState({ openDialogReject: false });
  };

  handleSnack = () => {
    this.setState({ openSnack: false });
  };

  handleSnackReject = () => {
    this.setState({ openSnackReject: false });
  };

  render() {
    const {
      request_list,
      rowsPerPage,
      page,
      openDialogAccept,
      openSnack,
      openSnackReject,
      openDialogReject,
    } = this.state;

    const Alert = (props) => {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
    };

    const columns = [
      { id: "date", label: "DATE", minWidth: 70, align: "left" },
      { id: "stock", label: "STOCK", minWidth: 100, align: "left" },
      { id: "productName", label: "PRODUCT", minWidth: 150, align: "left" },
      { id: "status", label: "STATUS", minWidth: 150, align: "left" },
      { id: "warehouseAsal", label: "WAREHOUSE", minWidth: 100, align: "left" },
      {
        id: "requestStock",
        label: "REQUEST QUANTITY",
        minWidth: 70,
        align: "center",
      },
      { id: "accept", label: "", minWidth: 70, align: "left" },
      { id: "reject", label: "", minWidth: 70, align: "left" },
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
                Request is Accepted!
              </Alert>
            </Snackbar>
          </div>
        }
        {
          <div className={classes.root}>
            <Snackbar
              open={openSnackReject}
              autoHideDuration={10000}
              onClose={this.handleSnackReject}
            >
              <Alert onClose={this.handleSnackReject} severity="info">
                Request is Rejected!
              </Alert>
            </Snackbar>
          </div>
        }
        {
          <div>
            <Dialog
              open={openDialogAccept}
              onClose={this.handleDialogAccepted}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Do you want to Accept this request?
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  The stock of these item will
                  decrease in your warehouse after you do this action..
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.onAcceptClick}
                  style={{ color: "#4aa96c" }}
                >
                  Accept
                </Button>
                <Button onClick={this.handleDialogAccepted}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </div>
        }

        {
          <div>
            <Dialog
              open={openDialogReject}
              onClose={this.handleDialogRejected}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Do you want to Reject this request?
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  The item requested by the original warehouse
                  will be canceled and the warehouse will not receive stock
                  from you..
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

        <React.Fragment>
          <div className="transaction-container">
            <div className="transaction-content">
              <div className="transaction-content-left">
                <p
                  className="transaction-text-1"
                  style={{ marginBottom: "5%" }}
                >
                  Request
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
                  {request_list.map((row, index) => {
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
                              column.id === "status" &&
                              row.status === "propose";
                            let style2 =
                              column.id === "status" &&
                              row.status === "accepted";
                            let style3 =
                              column.id === "status" &&
                              row.status === "rejected";
                            return (
                              <StyledTableCell align={column.align}>
                                <p
                                  className="transaction-text-2"
                                  style={{
                                    textAlign:
                                      style1 || style2 || style3
                                        ? "center"
                                        : "",
                                    backgroundColor: style1
                                      ? "#1859db77"
                                      : style2
                                      ? "#4aa96b5e"
                                      : style3
                                      ? "#da003773"
                                      : "none",
                                    color: style1
                                      ? "#185adb"
                                      : style2
                                      ? "#4aa96c"
                                      : style3
                                      ? "#da0037"
                                      : "#797979",
                                    fontWeight:
                                      style1 || style2 || style3 ? "bold" : 600,
                                  }}
                                >
                                  {column.id === "accept" && row.status === "propose" ? (
                                    <IconButton
                                      aria-label="expand row"
                                      size="small"
                                      onClick={() => this.handleAccepted(row)}
                                      style={{
                                        color: "#4aa96c",
                                      }}
                                    >
                                      <DoneAllIcon style={{fontSize: "19px"}} />
                                    </IconButton>
                                  ) : column.id === "reject" && row.status === "propose" ? (
                                    <IconButton
                                      aria-label="expand row"
                                      size="small"
                                      onClick={() =>
                                        this.handleRejectedReq(row)
                                      }
                                      style={{
                                        color: "#da0037",
                                      }}
                                    >
                                      <CloseIcon style={{fontSize: "19px"}} />
                                    </IconButton>
                                  ) : (
                                    value
                                  )}
                                </p>
                              </StyledTableCell>
                            );
                          })}
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
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(RequestStock);
