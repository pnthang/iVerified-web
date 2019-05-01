import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route,Redirect } from "react-router-dom";
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Home from './Home';
import About from './About';
import Contact from './Contact';

function Main({ match }) {
  return (
    <div>
      <div> 
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">iFo</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">      
              <Nav className="mr-auto">
                <Link to={`${match.url}/home`} class="nav-link" >Home</Link>
                <Link to={`${match.url}/about`} class="nav-link" >About</Link>
                <Link to={`${match.url}/contact`} class="nav-link" >Contact</Link>  
              </Nav>
              <Form inline>  
                <ButtonToolbar>    
                  <Button variant="outline-primary" size="lg">Login</Button>{" "}
                  <Button variant="outline-success" size="lg">Register</Button>
                </ButtonToolbar>
              </Form>
            </Navbar.Collapse>
          </Navbar>
        </div> 
        <div>                       
            <Route path={`${match.path}/:comId`} component={Content} />                
        </div>           
    </div>
  );
}

function Content({ match }) {
    const id = match.params.comId;
    let com = <Home/>;    
    switch(id){
        case 'about':
          com=<About/>;
          break;
        case 'contact':
          com =<Contact/>;
          break;
        default:
          com = <Home/>; 
          break;        
      }
    return (  
        <div>                       
           {com}
        </div>
    );
  }

  export default Main;