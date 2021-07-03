import React, { Component } from "react";
import Header from "../../components/Header";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ChairHome from "../../images/chair-home.jpg";
import Deal from "../../images/great-deal.png";
import Design from "../../images/great-design.png";
import Minimalist from "../../images/minimalist.png";
import Support from "../../images/support.png";
import { LogoutAction, ResetActionthunk } from "../../redux/actions";
import "./../styles/Home.css";

class Home extends Component {
  state = {
    cardText:
      "Far far away, behind the word mountains, far from the countries Vokalia.",
  };

  render() {
    return (
      <div className="home-content">
        <div className="jumbotron-one-home">
          <Header />
          <div className="left-content-home">
            <div className="inside-left-content-home">
              <h1 className="fournir-text-1-home">Best Design of</h1>
              <h1 className="fournir-text-2-home">Furniture Collections</h1>
              <h5 className="fournir-text-3-home">
                A small river named Duden flows by their place and supplies it
                with the necessary regelialia.
              </h5>
              <Link to="/collection" className="normal-link-home">
                <div className="btn-collection-home">See Collection</div>
              </Link>
            </div>
          </div>
          <div className="right-content-home">
            <img className="chair-home" src={ChairHome} />
          </div>
        </div>
        <div className="jumbotron-two-home">
          <div className="card-content-home">
            <div className="bg-image-home">
              <img className="card-img" src={Deal} alt="Deal" />
            </div>
            <div className="card-judul-home">Amazing Deals</div>
            <div className="card-text-home">{this.state.cardText}</div>
          </div>
          <div className="card-content-home">
            <div className="bg-image-home">
              <img className="card-img" src={Design} alt="Deal" />
            </div>
            <div className="card-judul-home">Quality Furniture</div>
            <div className="card-text-home">{this.state.cardText}</div>
          </div>
          <div className="card-content-home">
            <div className="bg-image-home">
              <img className="card-img" src={Minimalist} alt="Deal" />
            </div>
            <div className="card-judul-home">Modern Design</div>
            <div className="card-text-home">{this.state.cardText}</div>
          </div>
          <div className="card-content-home">
            <div className="bg-image-home">
              <img className="card-img" src={Support} alt="Deal" />
            </div>
            <div className="card-judul-home">Best Support</div>
            <div className="card-text-home">{this.state.cardText}</div>
          </div>
        </div>
        <div className="jumbotron-three-home">
          <h5 className="three-one-home">Our Collection</h5>
          <h1 className="three-two-home">Furniture Collection</h1>
          <div></div>
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

export default connect(MaptstatetoProps)(Home);
