import React, { Component } from 'react';
import '../css/App.css';
import AppNavFront from './AppNavFront';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Figure from 'react-bootstrap/Figure';
import CardDeck from 'react-bootstrap/CardDeck';
import Moment from 'react-moment';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { API_BASE_URL } from '../constants';

class Search extends Component {
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
    city: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      blocks:[],
      sku:'',
      show:'false'             
    };    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);  
    this.handleClick = this.handleClick.bind(this);  
  }      

  loadBlocks(productId){      
    const url = `${API_BASE_URL}/product/${productId}/blocks`;                    
    fetch(url)
        .then(response => response.json())
        .then(data => this.setState({
          blocks:data.content            
        })
    );
  }
  
  loadProduct(sku){
    if (sku) {
      fetch(`${API_BASE_URL}/product/sku/${sku}`)
        .then(response => response.json())
        .then (product => {
            if (product.id){
               this.loadBlocks(product.id);
            }
            this.setState({
              item: product,
              show:'true'
            });            
          }
        );       
    }
  }  

  handleChange(event) {
    const target = event.target;
    const value = target.value;           
    this.setState({sku:value});    
  }

  async handleSubmit(event) {
    event.preventDefault();    
    const sku = this.refs.sku.value;    
    this.loadProduct(sku);                      
  }

  handleClick(event){      
    const target = event.target;    
    const name = target.name;
    if (name==='close'){
      this.setState({show:''});  
    }        
  }

  render() {
    const {item,blocks,show} = this.state;   
    
    let province="";
    let country="";
    if (item.id>0){
      province=item.city.province.name;
      country=item.city.province.country.name;
    }
        
    const blockList = blocks.map(block => {         
      return <Card border="primary">
              <Card.Img variant="top" 
                    width={128}
                    height={128}
                    src={block.destination.logoImage} />
              <Card.Body>
                <Card.Title>{block.destination.name}</Card.Title>
                <Card.Text>                             
                  <Moment>
                      {block.createdAt}
                  </Moment>
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  hash: {block.hash}                  
                </small>
                <Button variant="info" size="sm">Learn more</Button>
              </Card.Footer>
            </Card>                  
    });

    var productChain = ""
    if (show==='true') {
            productChain = <div>                  
                  <Jumbotron fluid>
                    <Container>
                      <h1>{item.name}</h1>
                      <h6>Product of {province}, {country}</h6>            
                      <Figure>
                        <Figure.Image
                          width={300}
                          height={250}
                          alt={item.name}
                          src={item.thumbnailImages}
                        />
                        <Figure.Caption>
                        <p>{item.shortDescription}</p>
                        </Figure.Caption>
                      </Figure>
                      <Form>
                      <Form.Group>
                          <Button variant="primary" name="learnMore" ref="learnMore" onClick={this.handleClick}>Learn more</Button>{' '}
                          <Button variant="secondary" name="close" ref="close" onClick={this.handleClick}>Close</Button>
                      </Form.Group>        
                    </Form>                       
                    </Container>          
                  </Jumbotron> 
                  <CardDeck>
                    {blockList}          
                  </CardDeck>           
            </div>;
    } ;    
                 
    return (
      <div >         
        <Card border="success" className="text-center">          
          <Card.Body>
            <Card.Title>Identify item?</Card.Title>
            <Form onSubmit={e => this.handleSubmit(e)}>
                <InputGroup >
                  <FormControl
                    placeholder="Enter product's SKU or scan a QRcode"
                    aria-label="Product SKU"
                    aria-describedby="basic-addon2"
                    size="lg"
                    onChange={this.handleChange}
                    ref="sku"
                  />
                  <InputGroup.Append>
                    <Button variant="outline-success" type="submit">Locate</Button>
                  </InputGroup.Append>
                </InputGroup> 
            </Form>          
          </Card.Body>
          <Card.Footer className="text-muted">Grows, produces, manufactures, processes, packs, transports, holds, and sells </Card.Footer>
        </Card>
        {productChain}                
      </div>
    );
  }
}

export default Search;