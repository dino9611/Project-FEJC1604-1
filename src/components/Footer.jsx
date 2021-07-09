import React, { Component } from "react";
import Image from "./../images/footer.svg";
import Google from "./../images/google-play.png";
import Apple from "./../images/app-store.png";
import "./styles/Footer.css";

class Footer extends Component {
  state = {};
  render() {
    return (
      <div className="jumbotron-footer">
        <div className="footer-1">
          <div className="footer-1-inside">
            <div className="footer-1-1">
              <div>Fournir</div>
              <div>
                <p>about fournir</p>
                <p>property rights</p>
                <p>blog</p>
                <p>bridestory</p>
                <p>fournir parents</p>
                <p>mitra blog</p>
              </div>
            </div>
            <div className="footer-1-2">
              <div>Services</div>
              <div>
                <p>amazing deals</p>
                <p>quality furniture</p>
                <p>modern design</p>
                <p>best support</p>
              </div>
            </div>
            <div className="footer-1-3">
              <div>Contact Us</div>
              <div>
                <p>get in touch</p>
                <p>partner</p>
                <p>careers</p>
              </div>
            </div>
            <div className="footer-1-4">
              <div>Legal</div>
              <div>
                <p>privacy policy</p>
                <p>terms of use</p>
                <p>cookie policy</p>
                <p>booking terms and conditions</p>
              </div>
            </div>
          </div>
          <div className="footer-img-content">
            <div>
              <img src={Image} alt="" />
            </div>
            <div>
              <img src={Google} alt="" />
            </div>
          </div>
        </div>
        <div className="footer-2"></div>
      </div>
    );
  }
}

export default Footer;
