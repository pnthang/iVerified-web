import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import AppNavbar from '../AppNavbar';
import { API_BASE_URL } from '../../constants';

class EditForm extends Component {

    emptyItem = {    
      name: '',
      province:''
    };
  
    constructor(props) {
      super(props);
      this.state = {
        item: this.emptyItem,
        countries:[],
        provinces:[],
        countryId:'',
        validated: false        
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);      
    }  

    loadProvince(countryId){
      if(countryId){
        const url = `${API_BASE_URL}/country/${countryId}/provinces`;      
        fetch(url)
            .then(response => response.json())
            .then(data => this.setState({
              provinces:data.content            
            })
        );
      }
    }

    loadCountry(){
      const urlCountries = `${API_BASE_URL}/countries?sort=name`;             
      fetch(urlCountries)
          .then(response => response.json())
          .then(data => this.setState({
            countries:data.content            
          })
      );
    }

    async componentDidMount() {                            
      this.loadCountry();
      if (this.props.match.params.id !== 'new') {
        const city = await (await fetch(`${API_BASE_URL}/city/${this.props.match.params.id}`)).json();                                 
        //let item= city;
        //item.countryId = city.province.country.id;   
        fetch(`${API_BASE_URL}/country/${city.province.country.id}/provinces`)
          .then(response => response.json())
          .then(data => this.setState({
            provinces:data.content,
            item: city,  
            countryId: city.province.country.id          
          })
        );            
      }
    }
  
    handleChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;  
      console.log(name);  
      if (name==='country'){
        this.loadProvince(value);
      }
      else{
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item}); 
        console.log(item);
      }      
    }
    
    async handleSubmit(event) {
      event.preventDefault();
      const form = event.currentTarget;
      console.log(form.checkValidity());
      if (form.checkValidity() === false) {        
        this.setState({ validated: true });
        event.stopPropagation();
      }else{
        const {item} = this.state;
        item.province= this.refs['province'].value;        
        await fetch(`${API_BASE_URL}/city`, {
          method: (item.id) ? 'PUT' : 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(item),
        });
        this.props.history.push('/cities');  
      }                                
    }
  
    render() {
      const {item,provinces, countries,countryId, validated } = this.state;      
      
      console.log(item);
      const title = <h2>{item.id ? 'Edit City' : 'Add City'}</h2>;                    
      

      const countryList = countries.map(country => {        
        return <option  key={country.id} value={country.id} selected={country.id===countryId}>{country.name}</option>;   
      });

      const provinceList = provinces.map(province => {        
        return <option  key={province.id} value={province.id} selected={province.id===item.province.id}>{province.name}</option>;   
      });

      return <div>
        <AppNavbar/>
        <Container>
          {title}
          <Form noValidate
                validated={validated}
                onSubmit={e => this.handleSubmit(e)}>
            <Form.Group controlId="formBasicText" >
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" ref ="name" value={item.name || ''} onChange={this.handleChange} required/>
              <Form.Control.Feedback type="invalid">
                Please enter a province name.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicSelect" >
              <Form.Label>Country</Form.Label>
              <Form.Control as="select" name="country" ref="country" onChange={this.handleChange} required>
                <option value="" >Select ...</option>
                {countryList}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please select a country.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicSelect" >
              <Form.Label>Province</Form.Label>
              <Form.Control as="select" name="province" ref="province" onChange={this.handleChange} required>
                <option value="" >Select ...</option>
                {provinceList}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please select a province.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Button variant="primary" type="submit">Save</Button>{' '}
              <Button variant="secondary" href="/cities">Cancel</Button>
            </Form.Group>            
          </Form>          
        </Container>
      </div>
    }
  }
  
  export default withRouter(EditForm);
