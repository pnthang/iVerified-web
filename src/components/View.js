import React, { Component } from 'react';
import '../css/App.css';
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
import { IMG_BASE_URL } from '../constants';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Image from 'react-bootstrap/Image';
import downArrow from '../images/down.svg';
import Alert from 'react-bootstrap/Alert'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

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
      blocks:[],
      sku:'',
      show:'false',
      message:''             
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
  
  loadProduct(code){
    if (code) {
      fetch(`${API_BASE_URL}/product/code/${code}`)
        .then(response => response.json())
        .then (product => {            
            if (product.id){
               this.loadBlocks(product.id);
               this.setState({
                item: product,
                show:'true',
                message:''
              });  
            }else{
                this.setState({
                    item: this.emptyItem,
                    blocks:[],
                    show:'false',
                    message:'Not Found product! Please try again'
                });  
            }                              
          }
        );       
    }
  }  
  componentDidMount() {     
    if (this.props.match.params.hash) {
      this.loadProduct(this.props.match.params.hash);
    }
  }
  handleDetailClick() { 
    confirmAlert({
      title: 'Future works!',
      message: 'This function will be update soon!',
      buttons: [
        {
          label: 'Close' 
        }         
      ]
    });           
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
    const {item,blocks,show, message} = this.state;   
    const alertMessage = message? <Alert variant='danger'>{message}</Alert> : '';
    let province="";
    let country="";
    if (item.id>0){
      province=item.city.province.name;
      country=item.city.province.country.name;
    }
    let i=0;    
    const blockList = blocks.map(block => {  
      let logoUrl = `${IMG_BASE_URL}/${block.destination.logoImage}`;      
      let imgUrl = `${IMG_BASE_URL}/${block.image}`;
      let province="";
      let country="";
      if (block.id>0){
        province=block.destination.city.province.name;
        country=block.destination.city.province.country.name;
      }  
      let position='left';
      if (i%2==0){
        position='right';
      } 
      i++;              
      return <VerticalTimeline>
                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date={<Moment format="YYYY/MM/DD">{block.createdAt}</Moment>}                    
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}                    
                    position={position}
                    icon={<downArrow/>}
                >
                    <Image src={imgUrl} thumbnail />
                    <h3 className="vertical-timeline-element-title">{block.name}</h3>
                    <h4 className="vertical-timeline-element-subtitle">{province}, {country}</h4>
                    <p>
                    {block.description}
                    </p>
                    <Button size="sm" variant="primary" name="learnMore" ref="learnMore" onClick={this.handleDetailClick}>Learn more</Button>
                </VerticalTimelineElement>
            </VerticalTimeline>         
    });

    var productChain = ""    
    if (show==='true') {
            let imgUrl = `${IMG_BASE_URL}/${item.thumbnailImages}` ;
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
                          src={imgUrl}
                        />
                        <Figure.Caption>
                        <p>{item.shortDescription}</p>
                        </Figure.Caption>
                      </Figure>
                      <Form>
                      <Form.Group>
                          <Button variant="primary" name="learnMore" ref="learnMore" onClick={this.handleDetailClick}>Learn more</Button>{' '}
                          <Button variant="secondary" name="close" ref="close" onClick={this.handleClick}>Close</Button>
                      </Form.Group>        
                    </Form>                       
                    </Container>          
                  </Jumbotron>                                    
                  <Container>
                    {blockList} 
                  </Container>                                                                         
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
            {alertMessage}      
          </Card.Body>
          <Card.Footer className="text-muted">Grows, produces, manufactures, processes, packs, transports, holds, and sells </Card.Footer>
        </Card>
        {productChain}                
      </div>
    );
  }
}

export default View;