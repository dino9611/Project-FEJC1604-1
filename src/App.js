import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { LoginAction } from "./redux/actions";
import { connect } from "react-redux";
import Home from "./pages/users/Home";
import Login from "./pages/users/Login";
import Registration from "./pages/users/Registration";
import "./App.css";
import UserProfile from './pages/users/UserProfile';
import AddressList from './pages/users/Address';
import Security from './pages/users/Security';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/registration" exact component={Registration} />
          <Route path="/userprofile" exact component={UserProfile} />
          <Route path="/address" exact component={AddressList} />
          <Route path="/security" exact component={Security} />
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
