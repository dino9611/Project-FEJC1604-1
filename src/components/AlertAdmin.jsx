import React, { Component } from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import zIndex from "@material-ui/core/styles/zIndex";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

class AlertAdmin extends Component {
  state = {};
  render() {
    const { classes } = this.props;
    const Alert = (props) => {
      return <MuiAlert elevation={10000} variant="filled" {...props} />;
    };
    return ReactDOM.createPortal(
      <div style={{ zIndex: 11000 }} className={classes.root}>
        <Snackbar
          open={this.props.openSnack}
          autoHideDuration={6000}
          onClose={this.props.handleSnack}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={this.props.handleSnack} severity={this.props.status}>
            {this.props.message}
          </Alert>
        </Snackbar>
      </div>,
      document.getElementById("portal")
    );
  }
}

export default withStyles(useStyles)(AlertAdmin);
