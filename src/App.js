import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { LoginAction } from "./redux/actions";
import { connect } from "react-redux";
import { API_URL } from "./helper";
import { ToastContainer } from "react-toastify";
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
import WareHouseDashboard from "./pages/admin/WarehouseDashboard";
import axios from "axios";
import LoaderComp from "./components/Loader";
import ManageProduct from "./pages/admin/ManageProduct";
import Report from "./pages/admin/Report";
import ProductsFlow from "./pages/admin/ProductsFlow";
import ProductWarehouse from "./pages/admin/ProductWarehouse";
import CreateAdmin from "./pages/admin/CreateAdmin";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./pages/users/Cart";
import History from "./pages/users/History";
import NotFound from "./pages/NotFound";
import Payment from "./pages/users/Payment";
import ForgotPassword from "./pages/users/ForgotPassword";
import ResetPassword from "./pages/users/ResetPassword";
import ModalPW from "./components/ModalPW";

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
        // console.log("ini res.data", res.data);
        this.props.LoginAction(res.data);
        // console.log("ini dataUser", this.props.dataUser);
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

    const { role } = this.props.dataUser;

    if (role === 1) {
      return (
        <div>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/cart" exact component={Cart} />
            <Route path="/history" exact component={History} />
            <Route path="/collection" exact component={Collection} />
            <Route path="/productDetail/:id" exact component={ProductDetail} />
            <Route path="/login" exact component={Login} />
            <Route
              path="/verified-email/:token"
              component={EmailVerification}
            />

            <Route path="/address" exact component={AddressList} />
            <Route path="/security" exact component={Security} />
            <Route path="/userprofile" exact component={UserProfile} />
            <Route path="/payment" exact component={Payment} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      );
    }
    if (role === 2) {
      return (
        <div>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/collection" exact component={Collection} />
            <Route path="/productDetail/:id" exact component={ProductDetail} />
            <Route path="/admin" exact component={ManageProduct} />
            <Route path="/admin/login" exact component={LoginAdmin} />
            <Route path="/admin/home" exact component={HomeAdmin} />
            <Route path="/admin/dashboard/" component={WareHouseDashboard} />
            <Route path="/admin/report" exact component={Report} />
            <Route path="/admin/addAdmin" exact component={CreateAdmin} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      );
    }
    if (role > 2) {
      return (
        <div>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/collection" exact component={Collection} />
            <Route path="/productDetail/:id" exact component={ProductDetail} />
            <Route path="/admin/login" exact component={LoginAdmin} />
            <Route path="/admin/home" exact component={HomeAdmin} />
            <Route path="/admin/productsInOut" exact component={ProductsFlow} />
            <Route
              path="/admin/productsWarehouse"
              exact
              component={ProductWarehouse}
            />
            <Route path="/admin/dashboard/" component={WareHouseDashboard} />
            <Route path="/admin/modalpw" exact component={ModalPW} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      );
    }
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/collection" exact component={Collection} />
          <Route path="/productDetail/:id" exact component={ProductDetail} />
          <Route path="/registration" exact component={Registration} />
          <Route path="/login" exact component={Login} />
          <Route path="/admin/login" exact component={LoginAdmin} />
          <Route path="/admin/home" exact component={HomeAdmin} />
          <Route path="/admin/dashboard" exact component={WareHouseDashboard} />
          <Route path="/forgotPassword" component={ForgotPassword} />
          <Route path="/resetpassword/:token" component={ResetPassword} />
          <Route path="*" component={NotFound} />
        </Switch>
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
