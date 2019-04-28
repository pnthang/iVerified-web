import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import AppNavbar from '../AppNavbar';

class EditForm extends Component {

    emptyItem = {    
      firstname:'',    	
      lastname:'',	
      username:'',	    
      password:'',		
      profileImage:'',	      
      email:'',		 	
      phone:'',			
      role:'',
    };
  
    constructor(props) {
      super(props);
      this.state = {
        item: this.emptyItem,        
        validated: false        
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);  
      this.handlePhotos =  this.handlePhotos.bind(this);   
    }  
        

    async componentDidMount() {       
      if (this.props.match.params.id !== 'new') {
        const data = await (await fetch(`/api/user/${this.props.match.params.id}`)).json();
        this.setState({item: data});
        //localStorage.setItem('password', data ? data.password : '');
        //const user = rememberMe ? localStorage.getItem('user') : '';
      }
    }
  
    handleChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;              
      let item = {...this.state.item};
      item[name] = value;
      this.setState({item}); 
      console.log(item);            
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
        item.profileImage=uploadingFile.name;
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
        await fetch('/api/user', {
          method: (item.id) ? 'PUT' : 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(item),
        });
        this.props.history.push('/users');  
      }                                
    }
  
    render() {
      const {item,validated } = this.state;                  
      const title = <h2>{item.id ? 'Edit Product' : 'Add Product'}</h2>;    

      return <div>
        <AppNavbar/>
        <Container>
          {title}
          <Form noValidate
                validated={validated}
                onSubmit={e => this.handleSubmit(e)}>
            <Form.Row>
              <Form.Group as="Col" controlId="formBasicUsername" >
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="username" ref ="username" value={item.username || ''} onChange={this.handleChange} required/>
                <Form.Control.Feedback type="invalid">
                  Please enter a Username.
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
              <Form.Group as="Col" controlId="formBasicPassword" >
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" ref ="password" onChange={this.handleChange} value={item.password || ''} required/>
                <Form.Control.Feedback type="invalid">
                  Please enter a Password.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as="Col" controlId="formBasicRepassword" >
                <Form.Label>Retype Password</Form.Label>
                <Form.Control type="password" name="repassword" ref ="repassword" onChange={this.handleChange} value={item.password || ''} required/>
                <Form.Control.Feedback type="invalid">
                  Please retype the Password.
                </Form.Control.Feedback>
              </Form.Group>              
            </Form.Row>
            <Form.Row>
              <Form.Group as="Col" controlId="formBasicFirstname" >
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" name="firstname" ref ="firstname" value={item.firstname || ''} onChange={this.handleChange} required/>
                <Form.Control.Feedback type="invalid">
                  Please enter a first name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as="Col" controlId="formBasicLastname" >
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" name="lastname" ref ="lastname" value={item.lastname || ''} onChange={this.handleChange} required/>
                <Form.Control.Feedback type="invalid">
                  Please enter a lastname.
                </Form.Control.Feedback>
              </Form.Group>              
            </Form.Row>            
            <Form.Group>
              <Form.Label>Profile Image</Form.Label>
                  <Form.Control type="file" name="images" onChange={this.handlePhotos}                      
                       accept="*.*" >
              </Form.Control>
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
