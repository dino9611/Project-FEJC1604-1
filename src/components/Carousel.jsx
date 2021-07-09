import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slide1 from "./../images/slide-1.png";
import Slide2 from "./../images/slide-2.png";
import Slide3 from "./../images/slide-3.png";
import Header from "./Header";
import "./styles/Carousel.css";

class Carousel extends Component {
  state = {};
  render() {
    const settings = {
      className: "center",
      //   centerMode: true,
      infinite: true,
      //   centerPadding: "60px",
      slidesToShow: 1,
      speed: 500,
    };
    return (
      <div>
        <div className="home-carousel-jumbotron">
          <div className="home-carousel-content">
            <Slider {...settings} autoplay className="home-carousel-1">
              <div style={{ width: "100%", overflow: "hidden" }}>
                <img width="100%" height="100%" src={Slide1} alt="" />
              </div>
              <div style={{ width: "100%", overflow: "hidden" }}>
                <img width="100%" height="100%" src={Slide2} alt="" />
              </div>
              <div style={{ width: "100%", overflow: "hidden" }}>
                <img width="100%" height="100%" src={Slide3} alt="" />
              </div>
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

export default Carousel;
