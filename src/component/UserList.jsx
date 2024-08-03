import React, { useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import axios from 'axios';
import '../App.css';
import { Form, Row, Col } from 'react-bootstrap';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({ gender: '', country: '' });

  useEffect(() => {
    fetchUsers();
  }, [skip, sortField, sortOrder, filters]);

  const fetchUsers = async () => {
    const response = await axios.get('https://dummyjson.com/users', {
      params: {
        limit,
        skip,
        ...(sortField && { sort: `${sortField}-${sortOrder}` }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.country && { country: filters.country }),
      },
    });

    const fetchedUsers = response.data.users;
    setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]);
    if (fetchedUsers.length < limit) {
      setHasMore(false);
    }
  };

  const fetchMoreUsers = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    setSkip(0);
    setUsers([]);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    setSkip(0);
    setUsers([]);
  };

  const columns = [
    { dataField: 'id', text: 'ID', sort: true, onSort: () => handleSort('id') },
    { dataField: 'image', text: 'Image', formatter: (cell, row) => <img src={row.image} alt={row.firstName} style={{ width: '50px', borderRadius: '50%' }} /> },
    { dataField: 'fullName', text: 'Full Name', sort: true, onSort: () => handleSort('fullName'), formatter: (cell, row) => `${row.firstName} ${row.maidenName} ${row.lastName}` },
    { dataField: 'age', text: 'Age', sort: true, onSort: () => handleSort('age') },
    { dataField: 'gender', text: 'Gender', filter: selectFilter({ options: { male: 'Male', female: 'Female' } }) },
    { dataField: 'designation', text: 'Designation', formatter: (cell, row)=> `${row.company.title}` },
    { dataField: 'location', text: 'Location', sort: true,  formatter: (cell, row) => `${row.address.state} , ${row.address.country}` },

  ];

  return (
    <div>
      <div className="heading">
        <h2>User List</h2>
      </div>
      <Row className="mb-3">
        
        <div className='filters'>
          <Form.Group controlId="country">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={filters.country}
              onChange={handleFilterChange}
            />
          </Form.Group>
        </div>
      </Row>
      
      <BootstrapTable
        keyField="id"
        data={users}
        columns={columns}
        pagination={paginationFactory({ sizePerPage: limit })}
        filter={filterFactory()}
      />
      {hasMore && <div className="text-center"><button onClick={fetchMoreUsers}>Load More</button></div>}
    </div>
  );
};

export default UserList;
