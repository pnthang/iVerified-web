import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class AppNavbar extends Component {
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
    return <Navbar collapseOnSelect bg="dark" variant="dark">
    <Navbar.Brand href="/">iFo</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/products">Products</Nav.Link>               
        <Nav.Link href="/transfers">Transfers</Nav.Link>
        <NavDropdown title="Vendor" id="collasible-nav-dropdown">                    
          <NavDropdown.Item href="/producers">Producer</NavDropdown.Item>
          <NavDropdown.Item href="/suppliers">Supplier</NavDropdown.Item>
          <NavDropdown.Item href="/transporters">Transporter</NavDropdown.Item>          
        </NavDropdown>
        <NavDropdown title="Dataset" id="collasible-nav-dropdown">          
          <NavDropdown.Item href="/product-categories">Product Category</NavDropdown.Item>          
          <NavDropdown.Divider />
          <NavDropdown.Item href="/countries">Country</NavDropdown.Item>
          <NavDropdown.Item href="/provinces">Province</NavDropdown.Item>
          <NavDropdown.Item href="/cities">City</NavDropdown.Item>          
        </NavDropdown>
        <NavDropdown title="System" id="collasible-nav-dropdown">          
          <NavDropdown.Item href="/users">User</NavDropdown.Item>                    
          <NavDropdown.Item href="#">Role</NavDropdown.Item>             
        </NavDropdown>
      </Nav>
      <Nav>
        <Nav.Link href="#deets">Help</Nav.Link>
        <Nav.Link eventKey={2} href="#memes">
          @Admin
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>;
  }
}