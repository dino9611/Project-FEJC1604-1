import React, { Component } from "react";
import Header from "../../components/Header";
import { connect } from "react-redux";
import { ButtonBase } from "@material-ui/core";
import { Link } from "react-router-dom";
import ChairHome from "../../images/chair-home.jpg";
import { LogoutAction, ResetActionthunk } from "../../redux/actions";
import "../styles/Home.css";

class Home extends Component {

  onLogout = (e) => {
    this.props.LogoutAction();
  };

  render() {
    return (
      <div className="home-content">
        <Header />
        <div className="left-content-home">
          <div className="inside-left-content">
            <h1 className="fournir-text-1">Best Design of</h1>
            <h1 className="fournir-text-2">Furniture Collections</h1>
            <h5 className="fournir-text-3">
              A small river named Duden flows by their place and supplies it
              with the necessary regelialia.
            </h5>
            <Link to="/collection" className="normal-link">
              <div className="btn-collection">See Collection</div>
            </Link>
          </div>
        </div>
        <div className="right-content-home">
          <img className="chair-home" src={ChairHome} />
        </div>
      </div>
    );
  }
}

const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};

export default connect(MaptstatetoProps, {
  LogoutAction,
  ResetActionthunk,
})(Home);
