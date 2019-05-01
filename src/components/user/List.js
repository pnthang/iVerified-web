import React, { Component } from 'react';
import AppNavbar from '../AppNavbar';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Pagination from "react-js-pagination";
import upArrow from '../../images/up.svg';
import downArrow from '../../images/down.svg';
import { API_BASE_URL } from '../../constants';
import { IMG_BASE_URL } from '../../constants';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class List extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: [],
            isLoading: true,
            totalElements:0,
            page:1,
            size:10,
            sortProperty:"username",
            sortDirection:'ASC'                    
        };
        this.remove = this.remove.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
    }

    loadData(){  
      this.setState({isLoading:true});              
      const url = `${API_BASE_URL}/users?size=${this.state.size}&page=${this.state.page}&sort=${this.state.sortProperty},${this.state.sortDirection}`;      
      fetch(url)
          .then(response => response.json())
          .then(data => this.setState({
            data:data.content, 
            isLoading:false,              
            totalElements: data.totalElements,              
            size:data.size,                                 
          })
      );
    }
    componentDidMount(){
       this.loadData(); 
    }

    handlePageChange(pageNumber) {                      
      this.setState({page:pageNumber},() => {
        this.loadData();
      });      
    }

    handleSortChange(){      
      let sortDirection = this.state.sortDirection === 'ASC' ? 'DESC' : 'ASC';            
      this.setState({sortDirection:sortDirection},() => {
        this.loadData();
      });  
    }

    remove(id) { 
      confirmAlert({
        title: 'Confirm to Delete',
        message: 'Are you sure to delete this.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              fetch(`${API_BASE_URL}/user/${id}`, {
                method: 'DELETE',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              }).then(() => {
                let updatedData = [...this.state.data].filter(i => i.id !== id);
                this.setState({data: updatedData});
              });
            }
          },
          {
            label: 'No',
            //onClick: () => alert('Click No')
          }
        ]
      });           
    }

    render() {
        const {data, isLoading, totalElements,page,size,sortDirection} = this.state;
    
        if (isLoading) {
          return <p>Loading...</p>;
        }

        let sortImage = upArrow;
        if (sortDirection === 'DESC'){
          sortImage = downArrow;
        }
        const list = data.map(item => {
            let imgUrl = `${IMG_BASE_URL}/${item.profileImage}`;            
            return <tr key={item.id}>
              <td style={{whiteSpace: 'nowrap'}}>{item.username}</td>        
              <td style={{whiteSpace: 'nowrap'}}>{item.email}</td>      
              <td style={{whiteSpace: 'nowrap'}}><Image src={imgUrl} thumbnail /></td>
              <td>
                <ButtonGroup>
                  <Button size="sm" variant="primary" href={"/user/" + item.id}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => this.remove(item.id)}>Delete</Button>
                </ButtonGroup>
              </td>
            </tr>
        });
                          
        return (            
            <div>              
              <AppNavbar/>
              <Container fluid>
                <div className="float-right">
                  <Button variant="success" href="/user/new">Create new</Button>
                </div>
                <h3>Users</h3>
                <Table responsive="sm" striped bordered hover>
                  <thead>
                    <tr>
                        <th width="30%" >
                          Username
                          <img src={sortImage} className="arrow" onClick={this.handleSortChange}/>                          
                        </th>
                        <th width="30%" >
                          Email                          
                        </th>  
                        <th width="30%" >
                          Image                          
                        </th>                    
                        <th width="10%">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list}
                  </tbody>
                </Table>  
                <div>              
                <Pagination
                  prevPageText='prev'
                  nextPageText='next'
                  firstPageText='first'
                  lastPageText='last'
                  activePage={page}
                  itemsCountPerPage={size}
                  totalItemsCount={totalElements}
                  onChange={this.handlePageChange}
                />
                </div>
              </Container>
            </div>
          );
    }


}

export default List;