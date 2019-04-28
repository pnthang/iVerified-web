import React, { Component } from 'react';
import '../css/App.css';
import AppNavFront from './AppNavFront';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Figure from 'react-bootstrap/Figure';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import Moment from 'react-moment';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';


class Home extends Component {
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
      vendors:[],
      show:'false'             
    };    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);  
    this.handleClick = this.handleClick.bind(this);  
  }      

  loadBlocks(productId){      
    const url = `/api/product/${productId}/blocks`;                    
    fetch(url)
        .then(response => response.json())
        .then(data => this.setState({
          blocks:data.content            
        })
    );
  }

  loadVendors(){
    const url = `/api/vendors?sort=name`;             
    fetch(url)
        .then(response => response.json())
        .then(data => this.setState({
          vendors:data.content            
        })
    );
  }

  loadProduct(sku){
    if (sku) {
      fetch(`/api/product/sku/${sku}`)
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

  componentDidMount() {     
    this.loadVendors();
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
    const {item,blocks,vendors,show} = this.state;   
    
    let province="";
    let country="";
    if (item.id>0){
      province=item.city.province.name;
      country=item.city.province.country.name;
    }
    
    const vendorList = vendors.map(vendor => {         
      return <Card>
              <Card.Img variant="top" 
                    width={128}
                    height={128}
                    src={vendor.logoImage} />              
            </Card>                  
    });

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
           
      console.log(productChain);  
    return (
      <div > 
        <AppNavFront/>       
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              height="400"
              src={img1} 
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>PRODUCT TRACEABILITY</h3>
              <p>Quickly identify and locate potentially faulty items in the supply chain that could pose a hazard to consumers.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              height="400"
              src={img2}
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>BRAND PROTECTION</h3>
              <p>Improve productivity and quality control, as well as enhance brand image.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              height="400"
              src={img3}
              alt="Third slide"
            />

            <Carousel.Caption>
              <h3>PROCESS CONTROL</h3>
              <p>Improves management of work in process and Reduces inventory.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <Card border="success" className="text-center">          
          <Card.Body>
            <Card.Title>Identify item?</Card.Title>
            <Form onSubmit={e => this.handleSubmit(e)}>
                <InputGroup >
                  <FormControl
                    placeholder="Enter product's SKU or scan QRcode"
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
        <CardColumns>
          {vendorList}
        </CardColumns>
      </div>
    );
  }
}

export default Home;