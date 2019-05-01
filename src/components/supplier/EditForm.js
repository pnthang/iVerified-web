import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import AppNavbar from '../AppNavbar';
import { API_BASE_URL } from '../../constants';

class EditForm extends Component {

    emptyItem = {    
      name:'', 
      email:'',
      phone:'',
      webAddress:'',
      address:'',
      postcode:'',
      shortDescription:'',
      longDescription:'',
      logoImage:'',          
      city:''
    };
  
    constructor(props) {
      super(props);
      this.state = {
        item: this.emptyItem,        
        validated: false ,
        countries:[],
        provinces:[],
        cities:[],
        countryId:'',
        provinceId:''      
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);  
      this.handlePhotos =  this.handlePhotos.bind(this);   
    }  
        
    loadCountry(){
      const url = `${API_BASE_URL}/countries?sort=name`;             
      fetch(url)
          .then(response => response.json())
          .then(data => this.setState({
            countries:data.content            
          })
      );
    }

    loadProvince(countryId){
      if(countryId){
        const url = `${API_BASE_URL}/country/${countryId}/provinces`;      
        fetch(url)
            .then(response => response.json())
            .then(data => this.setState({
              provinces:data.content,
              cities:[]            
            })
        );
      }
    }

    loadCities(ProvinceId){
      if(ProvinceId){
        const url = `${API_BASE_URL}/province/${ProvinceId}/cities`;  
        console.log(url);    
        fetch(url)
            .then(response => response.json())
            .then(data => this.setState({
              cities:data.content            
            })
        );
      }
    }
    async componentDidMount() {
      this.loadCountry();       
      if (this.props.match.params.id !== 'new') {
        const data = await (await fetch(`${API_BASE_URL}/supplier/${this.props.match.params.id}`)).json();
        Promise.all([
          fetch(`${API_BASE_URL}/country/${data.city.province.country.id}/provinces`), 
          fetch(`${API_BASE_URL}/province/${data.city.province.id}/cities`)
        ])
        .then(([provinces, cities]) => { 
          return Promise.all([provinces.json(), cities.json()]); 
        })
        .then(([provinces, cities]) => {            
          this.setState({
            provinces:provinces.content,
            cities:cities.content,
            item: data,  
            countryId: data.city.province.country.id ,         
            provinceId: data.city.province.id
          });
        }); 
        //this.setState({item: data});
        //localStorage.setItem('password', data ? data.password : '');
        //const user = rememberMe ? localStorage.getItem('user') : '';
      }
    }
  
    handleChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;        
      if (name==='country'){
        this.loadProvince(value);        
      }else if(name==='province'){        
        this.loadCities(value);
        //this.setState({provinceId:''}); 
      }else{
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item}); 
        console.log(item);
      }             
    }
    
    handlePhotos(event) {
      event.preventDefault();
      let uploadingFile = event.target.files[0];  
      let form = new FormData();
      form.append('uploadingFile',uploadingFile);
      console.log(uploadingFile);
      if(uploadingFile) {
        fetch(`${API_BASE_URL}/upload`, {            
            method: "POST",
            body: form,
          })
          .then(response => console.log('Success:', response))
          .catch(error => console.error('Error:', error));          

        const {item} = this.state;
        item.logoImage = uploadingFile.name;
        this.setState({item});                        
      }else{
          console.log("no files selected");
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
        item.city= this.refs['city'].value; 
        console.log(item);            
        await fetch(`${API_BASE_URL}/supplier`, {
          method: (item.id) ? 'PUT' : 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(item),
        });
        this.props.history.push('/suppliers');  
      }                                
    }
  
    render() {
      const {item,validated,countries,provinces,cities,countryId, provinceId } = this.state;      
      console.log(item);
      const countryList = countries.map(country => {        
        return <option  key={country.id} value={country.id} selected={country.id===countryId}>{country.name}</option>;   
      });

      const provinceList = provinces.map(province => {        
        return <option  key={province.id} value={province.id} selected={province.id===provinceId}>{province.name}</option>;   
      });

      const cityList = cities.map(city => {        
        return <option  key={city.id} value={city.id} selected={city.id===item.city.id}>{city.name}</option>;   
      }); 
      const title = <h2>{item.id ? 'Edit Supplier' : 'Add Supplier'}</h2>;    

      return <div>
        <AppNavbar/>
        <Container>
          {title}
          <Form noValidate
                validated={validated}
                onSubmit={e => this.handleSubmit(e)}>
            <Form.Row>
              <Form.Group as="Col" controlId="formBasicname" >
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" ref ="name" value={item.name || ''} onChange={this.handleChange} required/>
                <Form.Control.Feedback type="invalid">
                  Please enter a Name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as="Col" controlId="formBasicEmail" >
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" name="email" ref ="email" value={item.email || ''} onChange={this.handleChange} required/>
                <Form.Control.Feedback type="invalid">
                  Please enter a Email.
                </Form.Control.Feedback>
              </Form.Group>              
            </Form.Row>
            <Form.Row>
              <Form.Group as="Col" controlId="formBasicPhone" >
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" name="phone" ref ="phone" onChange={this.handleChange} value={item.phone || ''} />                
              </Form.Group>
              <Form.Group as="Col" controlId="formBasicRepassword" >
                <Form.Label>Web Address</Form.Label>
                <Form.Control type="text" name="webAddress" ref ="webAddress" onChange={this.handleChange} value={item.webAddress || ''} />                
              </Form.Group>              
            </Form.Row>                       
            <Form.Group>
              <Form.Label>Logo image</Form.Label>
                  <Form.Control type="file" name="logoImage" onChange={this.handlePhotos}                      
                       accept="*.*" >
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicShortDescription" >
              <Form.Label>Short Description</Form.Label>
              <Form.Control as="textarea" rows="3" name="shortDescription" ref ="shortDescription" value={item.shortDescription || ''} onChange={this.handleChange}/>              
            </Form.Group>
            <Form.Group controlId="formBasicAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" ref ="address" value={item.address || ''} onChange={this.handleChange}/>  
            </Form.Group>
            <Form.Row>
              <Form.Group as="Col" controlId="formBasicCountry" >
                <Form.Label>Country</Form.Label>
                <Form.Control as="select" name="country" ref="country" onChange={this.handleChange} required>
                  <option value="" >Select ...</option>
                  {countryList}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select a country.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as="Col" controlId="formBasicProvince" >
                <Form.Label>Province</Form.Label>
                <Form.Control as="select" name="province" ref="province" onChange={this.handleChange} required>
                  <option value="" >Select ...</option>
                  {provinceList}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select a province.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as="Col" controlId="formBasicCity" >
                <Form.Label>City</Form.Label>
                <Form.Control as="select" name="city" ref="city" onChange={this.handleChange} required>
                  <option value="" >Select ...</option>
                  {cityList}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select a city.
                </Form.Control.Feedback>
              </Form.Group>              
            </Form.Row> 
               
            <Form.Group>
                <Button variant="primary" type="submit">Save</Button>{' '}
                <Button variant="secondary" href="/suppliers">Cancel</Button>
            </Form.Group>        
          </Form>          
        </Container>
      </div>
    }
  }
  export default withRouter(EditForm);
