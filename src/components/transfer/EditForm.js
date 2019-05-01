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
	    product:'',
		  description:'',  
      hash:'',
      previousHash:'',
      image:'',
      previousBlock:'',
      source:'',
      destination:'',
    };
  
    constructor(props) {
      super(props);
      this.state = {
        item: this.emptyItem,
        vendors:[],        
        productCategories:[],              
        products:[],
        blocks:[],
        validated: false        
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);  
      this.handlePhotos =  this.handlePhotos.bind(this);   
    }  
    
    loadProductCategories(){
      const url = `${API_BASE_URL}/product-categories?sort=name`;             
      fetch(url)
          .then(response => response.json())
          .then(data => this.setState({
            productCategories:data.content            
          })
      );
    }

    loadProducts(){
      const url = `${API_BASE_URL}/products?sort=name`;             
      fetch(url)
          .then(response => response.json())
          .then(data => this.setState({
            products:data.content            
          })
      );
    }

    loadVendors(){
      const url = `${API_BASE_URL}/vendors?sort=name`;             
      fetch(url)
          .then(response => response.json())
          .then(data => this.setState({
            vendors:data.content            
          })
      );
    }

    loadBlocks(productId){      
      const url = `${API_BASE_URL}/product/${productId}/blocks`; 
      console.log(url);                      
      fetch(url)
          .then(response => response.json())
          .then(data => this.setState({
            blocks:data.content            
          })
      );
    }

    async loadBlock(id){      
      const url = `${API_BASE_URL}/block/${id}`; 
      const previousBlock = await (await fetch(url)).json();                        
      let item = {...this.state.item};
      if (previousBlock.id){
        item.previousBlock = previousBlock.id; 
        item.previousHash = previousBlock.hash;       
      }      
      this.setState({item});
    }

    async loadProduct(id){
      const url = `${API_BASE_URL}/product/${id}`;             
      const product = await (await fetch(url)).json();  
      let item = {...this.state.item};
      if (product.id){
        item.previousHash = product.hash;
        item.source = product.producer.id;
        item.product = product.id;
      }      
      this.setState({item});
    }
          
    componentDidMount() { 
      this.loadProducts(); 
      this.loadVendors();                                
      if (this.props.match.params.id !== 'new') {
        fetch(`${API_BASE_URL}/block/${this.props.match.params.id}`)
          .then(response => response.json())
          .then(previousBlock => {
            if (previousBlock.product.id){              
              this.loadBlocks(previousBlock.product.id);
            }
            this.setState({item:previousBlock});
          }        
        );
      }
    }
  
    handleChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;        
      if (name==='product' && value>0){
        this.loadProduct(value);
        this.loadBlocks(value);
      }else if (name==='previousBlock' && value>0){        
        this.loadBlock(value);
      }
      else{
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
        item.image=uploadingFile.name;
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
        //item.city= this.refs['city'].value;        

        await fetch(`${API_BASE_URL}/block`, {
          method: (item.id) ? 'PUT' : 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(item),
        });
        this.props.history.push('/transfers');  
      }                                
    }
  
    render() {
      const {item,products,vendors,blocks, validated } = this.state;      
            
      const title = <h2>{item.id ? 'Edit Block' : 'Add Block'}</h2>;                    
      
      const productList = products.map(product => {        
        return <option  key={product.id} value={product.id} selected={product.id===item.product.id}>{product.name}</option>;   
      });
      
      const blockList = blocks.map(block => {        
        return <option  key={block.id} value={block.id} selected={block.id===(item.previousBlock? item.previousBlock.id:'')}>{block.name}</option>;   
      }); 

      const vendorList = vendors.map(vendor => {        
        return <option  key={vendor.id} value={vendor.id} selected={vendor.id===item.destination.id}>{vendor.name}</option>;   
      }); 

      return <div>
        <AppNavbar/>
        <Container>
          {title}
          <Form noValidate
                validated={validated}
                onSubmit={e => this.handleSubmit(e)}>
                                              
            <Form.Row>
              <Form.Group as="Col" controlId="formBasicProduct" >
                  <Form.Label>Product</Form.Label>
                  <Form.Control as="select" name="product" ref="product" onChange={this.handleChange} required>
                    <option value="" >Select ...</option>
                    {productList}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Please select a Product.
                  </Form.Control.Feedback>
              </Form.Group>             
              <Form.Group as="Col" controlId="formBasicPreviousBlock" >
                <Form.Label>Previous Block</Form.Label>
                <Form.Control as="select" name="previousBlock" ref="previousBlock" onChange={this.handleChange}>
                  <option value="" >Select ...</option>
                  {blockList}
                </Form.Control>                
              </Form.Group>
            </Form.Row> 
            <Form.Group controlId="formBasicDestination" >
                <Form.Label>Destination</Form.Label>
                <Form.Control as="select" name="destination" ref="destination" onChange={this.handleChange} required>
                  <option value="" >Select ...</option>
                  {vendorList}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select a Vendor.
                </Form.Control.Feedback>
              </Form.Group>
            <Form.Row>            
              <Form.Group as="Col" controlId="formBasicName" >
                <Form.Label>Tranfer Name</Form.Label>
                <Form.Control type="text" name="name" ref ="name" value={item.name || ''} onChange={this.handleChange} required/>
                <Form.Control.Feedback type="invalid">
                  Please enter a product name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as="Col" controlId="formBasicDescription" >
                <Form.Label>Detail</Form.Label>
                <Form.Control type="text" name="description" ref ="description" value={item.description || ''} onChange={this.handleChange} />                
              </Form.Group>              
            </Form.Row>                        
            <Form.Group>
              <Form.Label>Image</Form.Label>
                  <Form.Control type="file" name="images" onChange={this.handlePhotos}                      
                       accept="*.*" >
              </Form.Control>
          </Form.Group>
              
            <Form.Group>
                <Button variant="primary" type="submit">Save</Button>{' '}
                <Button variant="secondary" href="/transfers">Cancel</Button>
            </Form.Group>        
          </Form>          
        </Container>
      </div>
    }
  }
  
  export default withRouter(EditForm);
