/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface HrEmployee {
  email: string;
  group: string;
  name: string;
}
const Home = () => {
  const [hrCount, setAdminCount] = useState();
  const [employeeCount, setEmployeeCount] = useState();
  const [hrEmployees, setHrEmployees] = useState<HrEmployee[]>([]);

  const usenavigate = useNavigate();
  let token = localStorage.getItem('token');
  useEffect(() => {
    if (token === '' || !token) {
      usenavigate('/login');
    }
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}employees/all?group=hr`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        setAdminCount(res.data.pagination.totalDocs);
        setHrEmployees(res.data.employees);
      })
      .catch((err) => console.log(err));

    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}employees/all?group=normal`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        setEmployeeCount(res.data.pagination.totalDocs);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>HR</h4>
          </div>
          <hr />
          <div className=''>
            <h5>Total: {hrCount}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Employee</h4>
          </div>
          <hr />
          <div className=''>
            <h5>Total: {employeeCount}</h5>
          </div>
        </div>
      </div>

      {/* List of hr  */}
      <div className='mt-4 px-5 pt-3'>
        <h3>List of Admins</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Group</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          {hrEmployees.map((hrEmployee, index) => (
            <tr key={index}>
              <td>{hrEmployee.email}</td>
              <td>{hrEmployee.group}</td>
              <td>{hrEmployee.name}</td>
              <td>Action</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default Home;
