import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: "100%",
//     "& > * + *": {
//       marginTop: theme.spacing(2),
//     },
//   },
// }));

const styles = {
  root: {
    width: "100%",
  },
};

class AlertAdmin extends Component {
  state = {};
  render() {
    const { classes } = this.props;
    const Alert = (props) => {
      return <MuiAlert elevation={10000} variant="filled" {...props} />;
    };
    return (
      <div className={classes.root}>
        <Snackbar
          open={this.props.openSnack}
          autoHideDuration={4000}
          onClose={this.props.handleSnack}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
            elevation={10000}
            variant="filled"
            onClose={this.props.handleSnack}
            severity={this.props.status}
          >
            {this.props.message}
          </MuiAlert>
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles)(AlertAdmin);
