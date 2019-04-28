import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import AppNavbar from '../AppNavbar';

class EditForm extends Component {

    emptyItem = {
      name: ''
    };
  
    constructor(props) {
      super(props);
      this.state = {
        item: this.emptyItem,
        validated: false 
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    async componentDidMount() {
      if (this.props.match.params.id !== 'new') {
        const country = await (await fetch(`/api/product-category/${this.props.match.params.id}`)).json();
        this.setState({item: country});
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
        this.setState({ validated: true });
        event.stopPropagation();
      }else{
        const {item} = this.state;
        await fetch('/api/product-category', {
          method: (item.id) ? 'PUT' : 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(item),
        });
        this.props.history.push('/product-categories');  
      }                  
    }
  
    render() {
      const {item,validated} = this.state;
      const title = <h2>{item.id ? 'Edit Product Category' : 'Add Product Category'}</h2>;
  
      return <div>
        <AppNavbar/>
        <Container>
          {title}
          <Form noValidate
                validated={validated}
                onSubmit={e => this.handleSubmit(e)}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" ref ="name" value={item.name || ''} onChange={this.handleChange} required/>
              <Form.Control.Feedback type="invalid">
                Please enter a province name.
              </Form.Control.Feedback>
            </Form.Group>                        
            <Form.Group>
              <Button variant="primary" type="submit">Save</Button>{' '}
              <Button variant="secondary" href="/product-categories">Cancel</Button>
            </Form.Group>    
          </Form>
        </Container>
      </div>
    }
  }
  
  export default withRouter(EditForm);
