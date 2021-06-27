import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { LoginAction } from "./redux/actions";
import { connect } from "react-redux";
import { API_URL } from "./helper";
import { ToastContainer, toast } from "react-toastify";
import Login from "./pages/users/Login";
import Registration from "./pages/users/Registration";
import Home from "./pages/users/Home";
import UserProfile from "./pages/users/UserProfile";
import Collection from "./pages/users/Collection";
import AddressList from "./pages/users/Address";
import Security from "./pages/users/Security";
import EmailVerification from "./pages/users/EmailVerification";
import ProductDetail from "./pages/users/ProductDetail";
import LoginAdmin from "./pages/admin/Login";
import HomeAdmin from "./pages/admin/Home";
import AdminTransaction from "./pages/admin/Transaction";
import axios from "axios";
import LoaderComp from "./components/Loader";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    let tokenAccess = localStorage.getItem("TA");
    axios
      .get(`${API_URL}/auth/keeplogin`, {
        headers: {
          Authorization: "Bearer " + tokenAccess,
        },
      })
      .then((res) => {
        console.log(res);
        this.props.LoginAction(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    if (this.state.loading) {
      return <LoaderComp />;
    }
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/registration" exact component={Registration} />
          <Route path="/collection" exact component={Collection} />
          <Route path="/productDetail/:id" exact component={ProductDetail} />
          <Route path="/verified-email/:token" component={EmailVerification} />
          <Route path="/address" exact component={AddressList} />
          <Route path="/security" exact component={Security} />
          <Route path="/userprofile" exact component={UserProfile} />
          <Route path="/admin/login" component={LoginAdmin} />
          <Route path="/admin/home" component={HomeAdmin} />
          <Route path="/admin/transaction" component={AdminTransaction} />
        </Switch>
        <ToastContainer />
      </div>
    );
  }
}

const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};
export default connect(MaptstatetoProps, { LoginAction })(App);
