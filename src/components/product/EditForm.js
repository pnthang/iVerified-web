import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import AppNavbar from '../AppNavbar';

class EditForm extends Component {

    emptyItem = {    
      name: '',
      productionDate: '',
      expirationDate: '',
      address: '',
      postcode: '',
      sku: '',
      shortDescription: '',
      longDescription: '',
      thumbnailImages: '',
      largeImage: '',    
      latitude: '',
      longitude: '',      
      productCategory: '',
      producer: '',
      city: '',
    };
  
    constructor(props) {
      super(props);
      this.state = {
        item: this.emptyItem,
        countries:[],
        provinces:[],
        cities:[],
        productCategories:[],        
        producers:[],
        countryId:'',
        provinceId:'',        
        validated: false        
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);  
      this.handlePhotos =  this.handlePhotos.bind(this);   
    }  
    
    loadProductCategory(){
      const url = `/api/product-categories?sort=name`;             
      fetch(url)
          .then(response => response.json())
          .then(data => this.setState({
            productCategories:data.content            
          })
      );
    }

    loadProducer(){
      const url = `/api/producers?sort=name`;             
      fetch(url)
          .then(response => response.json())
          .then(data => this.setState({
            producers:data.content            
          })
      );
    }
    
    loadCountry(){
      const url = `/api/countries?sort=name`;             
      fetch(url)
          .then(response => response.json())
          .then(data => this.setState({
            countries:data.content            
          })
      );
    }

    loadProvince(countryId){
      if(countryId){
        const url = `/api/country/${countryId}/provinces`;      
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
        const url = `/api/province/${ProvinceId}/cities`;  
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
      this.loadProductCategory();                           
      this.loadCountry();
      this.loadProducer();
      if (this.props.match.params.id !== 'new') {
        const product = await (await fetch(`/api/product/${this.props.match.params.id}`)).json();                                 
        //let item= city;
        //item.countryId = city.province.country.id; 
        Promise.all([
            fetch(`/api/country/${product.city.province.country.id}/provinces`), 
            fetch(`/api/province/${product.city.province.id}/cities`)
          ])
          .then(([provinces, cities]) => { 
            return Promise.all([provinces.json(), cities.json()]); 
          })
          .then(([provinces, cities]) => {            
            this.setState({
              provinces:provinces.content,
              cities:cities.content,
              item: product,  
              countryId: product.city.province.country.id ,         
              provinceId: product.city.province.id
            });
          });                     
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
        fetch('/api/upload', {            
            method: "POST",
            body: form,
          })
          .then(response => console.log('Success:', response))
          .catch(error => console.error('Error:', error));          

        const {item} = this.state;
        item.thumbnailImages=uploadingFile.name;
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
        item.city= this.refs.city.value;
        item.producer= this.refs.producer.value;
        item.productCategory= this.refs.productCategory.value;  

        await fetch('/api/product', {
          method: (item.id) ? 'PUT' : 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(item),
        });
        this.props.history.push('/products');  
      }                                
    }
  
    render() {
      const {item,provinces, countries,cities,productCategories,producers,countryId,provinceId, validated } = this.state;      
      
      console.log(provinces);
      const title = <h2>{item.id ? 'Edit Product' : 'Add Product'}</h2>;                    
      
      const productCategoryList = productCategories.map(productCategory => {        
        return <option  key={productCategory.id} value={productCategory.id} selected={productCategory.id===item.productCategory.id}>{productCategory.name}</option>;   
      });

      const countryList = countries.map(country => {        
        return <option  key={country.id} value={country.id} selected={country.id===countryId}>{country.name}</option>;   
      });

      const provinceList = provinces.map(province => {        
        return <option  key={province.id} value={province.id} selected={province.id===provinceId}>{province.name}</option>;   
      });

      const cityList = cities.map(city => {        
        return <option  key={city.id} value={city.id} selected={city.id===item.city.id}>{city.name}</option>;   
      });      

      const producerList = producers.map(producer => {        
        return <option  key={producer.id} value={producer.id} selected={producer.id===item.producer.id}>{producer.name}</option>;   
      }); 

      return <div>
        <AppNavbar/>
        <Container>
          {title}
          <Form noValidate
                validated={validated}
                onSubmit={e => this.handleSubmit(e)}>
                                                
            <Form.Row>
              <Form.Group as="Col" controlId="formBasicProducer" >
                  <Form.Label>Producer</Form.Label>
                  <Form.Control as="select" name="producer" ref="producer" onChange={this.handleChange} required>
                    <option value="" >Select ...</option>
                    {producerList}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Please select a Producer.
                  </Form.Control.Feedback>
              </Form.Group>              
              <Form.Group as="Col" controlId="formBasicProductCategory" >
                <Form.Label>Product Category</Form.Label>
                <Form.Control as="select" name="productCategory" ref="productCategory" onChange={this.handleChange} required>
                  <option value="" >Select ...</option>
                  {productCategoryList}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select a product category.
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row> 
            <Form.Row>            
              <Form.Group as="Col" controlId="formBasicName" >
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" ref ="name" value={item.name || ''} onChange={this.handleChange} required/>
                <Form.Control.Feedback type="invalid">
                  Please enter a product name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as="Col" controlId="formBasicSku" >
                <Form.Label>SKU</Form.Label>
                <Form.Control type="text" name="sku" ref ="sku" value={item.sku || ''} onChange={this.handleChange} required/>
                <Form.Control.Feedback type="invalid">
                  Please enter a sku.
                </Form.Control.Feedback>
              </Form.Group>              
            </Form.Row>            
            <Form.Group controlId="formBasicShortDescription" >
              <Form.Label>Short Description</Form.Label>
              <Form.Control as="textarea" rows="3" name="shortDescription" ref ="shortDescription" value={item.shortDescription || ''} onChange={this.handleChange}/>              
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
                  <Form.Control type="file" name="images" onChange={this.handlePhotos}                      
                       accept="*.*" >
              </Form.Control>
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
                <Button variant="secondary" href="/products">Cancel</Button>
            </Form.Group>        
          </Form>          
        </Container>
      </div>
    }
  }
  
  export default withRouter(EditForm);
