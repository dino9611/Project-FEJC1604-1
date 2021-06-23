import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { LoginAction } from "./redux/actions";
import { connect } from "react-redux";
import Home from "./pages/users/Home";
import Login from "./pages/users/Login";
import Registration from "./pages/users/Registration";
import "./App.css";
import LoginAdmin from './pages/admin/Login';


class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/registration" exact component={Registration} />
          <Route path="/admin/login" component={LoginAdmin} />
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
