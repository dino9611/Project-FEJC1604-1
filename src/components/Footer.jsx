import React, { Component } from "react";
import Image from "./../images/footer.svg";
import Google from "./../images/google-play.png";
import {
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillFacebook,
  AiFillYoutube,
} from "react-icons/ai";
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
                <div className="footer-1-logo">
                  <div>
                    <AiFillTwitterCircle />
                  </div>
                  <div>
                    <AiFillInstagram />
                  </div>
                  <div>
                    <AiFillFacebook />
                  </div>
                  <div>
                    <AiFillYoutube />
                  </div>
                </div>
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
              <a href="https://play.google.com/store" target="_blank">
                <img src={Google} alt="" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-2">
          <div className="footer-2-in">
            <span>&#169;</span> 2021 JCWM1604 WAO. Made In Indonesia. Thanks To
            Mas Dino.
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
