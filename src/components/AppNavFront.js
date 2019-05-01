import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {Route } from "react-router-dom";
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

export default class AppNavFront extends Component {
  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return <div id="dashboard">
           <div> 
            <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">iFo</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">      
              <Nav className="mr-auto">
                <Nav.Link exact href="/">Home</Nav.Link> 
                <Nav.Link exact href="#about">About us</Nav.Link>        
                <Nav.Link exact href="#contact">Contact us</Nav.Link>        
              </Nav>            
            </Navbar.Collapse>
          </Navbar>;
          </div>               
      </div>
  }
}