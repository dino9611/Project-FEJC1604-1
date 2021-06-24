import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { LoginAction } from "./redux/actions";
import { connect } from "react-redux";
import Home from "./pages/users/Home";
import Collection from "./pages/users/Collection";
import ProductDetail from "./pages/users/ProductDetail";
import Login from "./pages/users/Login";
import Registration from "./pages/users/Registration";
import LoginAdmin from "./pages/admin/Login";
import HomeAdmin from "./pages/admin/Home";
import { API_URL } from "./helper";
import axios from "axios";
import LoaderComp from "./components/Loader";
import EmailVerification from "./pages/users/EmailVerification";
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
          <Route path="/collection" exact component={Collection} />
          <Route path="/productDetail/:id" exact component={ProductDetail} />
          <Route path="/login" exact component={Login} />
          <Route path="/registration" exact component={Registration} />
          <Route path="/admin/login" component={LoginAdmin} />
          <Route path="/admin/home" component={HomeAdmin} />
          <Route path="/verified-email/:token" component={EmailVerification} />
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
