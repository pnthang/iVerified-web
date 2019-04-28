import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Admin from './Admin';
import Home from './Home';
import View from './View';

import CountryList from './country/List';
import CountryForm from './country/EditForm';

import ProvinceList from './province/List';
import ProvinceForm from './province/EditForm';

import CityList from './city/List';
import CityForm from './city/EditForm';

import CategoryList from './category/List';
import CategoryForm from './category/EditForm';

import ProductList from './product/List';
import ProductForm from './product/EditForm';

import TransferList from './transfer/List';
import TransferForm from './transfer/EditForm';

import UserList from './user/List';
import UserForm from './user/EditForm';

import ProducerList from './producer/List';
import ProducerForm from './producer/EditForm';

import SupplierList from './supplier/List';
import SupplierForm from './supplier/EditForm';

import TransporterList from './transporter/List';
import TransporterForm from './transporter/EditForm';

import '../css/App.css';


class App extends Component {
  render() {
    return (   
         
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/admin' exact={true} component={Admin}/>
          <Route path='/view/:hash' exact={true} component={View}/>
          
          <Route path='/countries' exact={true} component={CountryList}/>
          <Route path='/country/:id' component={CountryForm}/>
          
          <Route path='/provinces' exact={true} component={ProvinceList}/>
          <Route path='/province/:id' component={ProvinceForm}/>

          <Route path='/cities' exact={true} component={CityList}/>
          <Route path='/city/:id' component={CityForm}/>

          <Route path='/product-categories' exact={true} component={CategoryList}/>
          <Route path='/product-category/:id' component={CategoryForm}/>

          <Route path='/products' exact={true} component={ProductList}/>
          <Route path='/product/:id' component={ProductForm}/>

          <Route path='/users' exact={true} component={UserList}/>
          <Route path='/user/:id' component={UserForm}/>

          <Route path='/producers' exact={true} component={ProducerList}/>
          <Route path='/producer/:id' component={ProducerForm}/>

          <Route path='/transfers' exact={true} component={TransferList}/>
          <Route path='/transfer/:id' component={TransferForm}/>

          <Route path='/suppliers' exact={true} component={SupplierList}/>
          <Route path='/supplier/:id' component={SupplierForm}/>

          <Route path='/transporters' exact={true} component={TransporterList}/>
          <Route path='/transporter/:id' component={TransporterForm}/>
        
        </Switch>
      </Router>             
    )
  }
}

export default App;
