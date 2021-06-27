import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { LoginAction } from "./redux/actions";
import { connect } from "react-redux";
import Home from "./pages/users/Home";
import Collection from "./pages/users/Collection";
import ProductDetail from "./pages/users/ProductDetail";
import Cart from "./pages/users/Cart";
import History from "./pages/users/History";
import Login from "./pages/users/Login";
import Registration from "./pages/users/Registration";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/cart" exact component={Cart} />
          <Route path="/history" exact component={History} />
          <Route path="/collection" exact component={Collection} />
          <Route path="/productDetail/:id" exact component={ProductDetail} />
          <Route path="/login" exact component={Login} />
          <Route path="/registration" exact component={Registration} />
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
