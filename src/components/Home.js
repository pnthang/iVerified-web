import React, { Component } from 'react';
import '../css/App.css';
import Brand from './Brand';
import Slide from './Slide';
import Search from './Search';
import AppNavFront from './AppNavFront';

class Home extends Component {  
  render() {    
    return (
      <div >
        <AppNavFront/>         
        <Search/>   
        <Slide/>                     
        <Brand/>        
      </div>
    );
  }
}

export default Home;