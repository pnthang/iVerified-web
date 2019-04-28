import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
    return <Navbar bg="light" expand="lg">
    <Navbar.Brand href="/">iFo</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">      
      <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link> 
        <Nav.Link href="#about">About us</Nav.Link>        
        <Nav.Link href="#contact">Contact us</Nav.Link>        
      </Nav>
      <Form inline>      
        <Button variant="outline-primary">Login</Button>{' '}
        <Button variant="outline-success">Register</Button>
      </Form>
    </Navbar.Collapse>
  </Navbar>;
  }
}