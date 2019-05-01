import React, { Component } from 'react';
import '../css/App.css';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';


class Slide extends Component {
  render() {    
    return (
      <div >        
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              height="400"
              src={img1} 
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>PRODUCT TRACEABILITY</h3>
              <p>Quickly identify and locate potentially faulty items in the supply chain that could pose a hazard to consumers.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              height="400"
              src={img2}
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>BRAND PROTECTION</h3>
              <p>Improve productivity and quality control, as well as enhance brand image.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              height="400"
              src={img3}
              alt="Third slide"
            />

            <Carousel.Caption>
              <h3>PROCESS CONTROL</h3>
              <p>Improves management of work in process and Reduces inventory.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>              
      </div>
    );
  }
}

export default Slide;