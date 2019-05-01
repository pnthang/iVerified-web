import React, { Component } from 'react';
import '../css/App.css';
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import { API_BASE_URL } from '../constants';

class Brand extends Component {  
  constructor(props) {
    super(props);
    this.state = {      
      vendors:[]     
    };            
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
  componentDidMount() {     
    this.loadVendors();
  }

  render() {
    const {vendors} = this.state;       
    const vendorList = vendors.map(vendor => {         
      return <Card border="secondary">
              <Card.Img variant="top" 
                    width={128}
                    height={128}
                    src={vendor.logoImage} />              
            </Card>                  
    });

    return (
      <div >            
        <p className="text-center"><h4>Our brands</h4></p>
        <CardColumns>
          {vendorList}
        </CardColumns>
      </div>
    );
  }
}

export default Brand;