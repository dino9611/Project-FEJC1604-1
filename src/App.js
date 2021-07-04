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
import ManageProduct from "./pages/admin/ManageProduct";
import ModalDP from "./components/ModalDP";
import Report from "./pages/admin/Report";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./pages/users/Cart";
import History from "./pages/users/History";

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
          <Route path="/cart" exact component={Cart} />
          <Route path="/history" exact component={History} />
          <Route path="/collection" exact component={Collection} />
          <Route path="/cart" component={Cart} />
          <Route path="/productDetail/:id" exact component={ProductDetail} />
          <Route path="/login" exact component={Login} />
          <Route path="/registration" exact component={Registration} />
          <Route path="/collection" exact component={Collection} />
          <Route path="/productDetail/:id" exact component={ProductDetail} />
          <Route path="/verified-email/:token" component={EmailVerification} />
          <Route path="/address" exact component={AddressList} />
          <Route path="/security" exact component={Security} />
          <Route path="/admin" exact component={ManageProduct} />
          <Route path="/userprofile" exact component={UserProfile} />
          <Route path="/admin/login" component={LoginAdmin} />
          <Route path="/admin/home" component={HomeAdmin} />
          <Route path="/admin/transaction" component={AdminTransaction} />
          <Route path="/admin/report" component={Report} />
          {/* <Route path="/admin/itemsFlow" component={AdminInOut} /> */}
          <Route path="/modalDP" component={ModalDP} />
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
