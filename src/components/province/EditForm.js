import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import AppNavbar from '../AppNavbar';

class EditForm extends Component {

    emptyItem = {    
      name: '',
      country:''
    };
  
    constructor(props) {
      super(props);
      this.state = {
        item: this.emptyItem,
        countries:[],
        validated: false        
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    async componentDidMount() {      
      const url = `/api/countries?sort=name`;      
      fetch(url)
          .then(response => response.json())
          .then(data => this.setState({
            countries:data.content            
          })
      );
      
      if (this.props.match.params.id !== 'new') {
        const data = await (await fetch(`/api/province/${this.props.match.params.id}`)).json();      
        this.setState({
          item: data
        });
      }
    }
  
    handleChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;
      let item = {...this.state.item};
      item[name] = value;
      this.setState({item});            
    }
    
    async handleSubmit(event) {
      event.preventDefault();
      const form = event.currentTarget;
      console.log(form.checkValidity());
      if (form.checkValidity() === false) {
        //event.preventDefault();
        this.setState({ validated: true });
        event.stopPropagation();
      }else{
        const {item} = this.state;
        item.country= this.refs['country'].value;

        await fetch('/api/province', {
          method: (item.id) ? 'PUT' : 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(item),
        });
        this.props.history.push('/provinces');  
      }                                
    }
  
    render() {
      const {item,countries, validated } = this.state; 
      console.log(item);                    
      const title = <h2>{item.id ? 'Edit Province' : 'Add Province'}</h2>;         
      const countryList = countries.map(country => {        
          return <option  key={country.id} value={country.id} selected={country.id==item.country.id}>{country.name}</option>;   
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
            <Form.Group>
              <Button variant="primary" type="submit">Save</Button>{' '}
              <Button variant="secondary" href="/provinces">Cancel</Button>
            </Form.Group>            
          </Form>          
        </Container>
      </div>
    }
  }
  
  export default withRouter(EditForm);
