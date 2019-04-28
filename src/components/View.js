import React, { Component } from 'react';
import '../css/App.css';
import AppNavFront from './AppNavFront';
import { Link } from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Figure from 'react-bootstrap/Figure';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Moment from 'react-moment';
import 'moment-timezone';


class View extends Component {

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
      blocks:[]             
    };        
  }      

  loadBlocks(productId){      
    const url = `/api/product/${productId}/blocks`; 
    console.log(productId);                      
    fetch(url)
        .then(response => response.json())
        .then(data => this.setState({
          blocks:data.content            
        })
    );
  }

  componentDidMount() {     
    if (this.props.match.params.hash) {
      fetch(`/api/product/code/${this.props.match.params.hash}`)
        .then(response => response.json())
        .then (product => {
            if (product.id){
               this.loadBlocks(product.id);
            }
            this.setState({item: product});
          }
        );       
    }
  }

  render() {
    const {item,blocks} = this.state; 
    let province="";
    let country="";
    if (item.id>0){
      province=item.city.province.name;
      country=item.city.province.country.name;
    }

    const blockList = blocks.map(block => {         
      return <Card>
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

    return (
      <div>
        <AppNavFront/>
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
            </Figure>;
            <p>
            <Button variant="primary">Learn more</Button>
          </p>
          </Container>          
        </Jumbotron>; 

        <CardDeck>
          {blockList}          
        </CardDeck>;           
      </div>
    );
  }
}

export default View;