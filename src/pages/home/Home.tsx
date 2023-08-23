/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
interface HrEmployee {
  email: string;
  group: string;
  name: string;
}
const Home = () => {
  const [hrCount, setAdminCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState();
  const [hrEmployees, setHrEmployees] = useState<HrEmployee[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalDocs, setTotalDocs] = useState(0);

  const usenavigate = useNavigate();
  let token = localStorage.getItem('token');
  useEffect(() => {
    if (token === '' || !token) {
      usenavigate('/login');
    }
  });

  const loadHrEmployees = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}employees/all?group=hr&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data.employees);
        setAdminCount(res.data.pagination.totalDocs);
        setTotalDocs(res.data.pagination.totalDocs);
        setHrEmployees(res.data.employees);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadHrEmployees();
  }, [pageNumber]);
  useEffect(() => {
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
  });
  const handleNext = () => {
    setPageNumber(pageNumber + 1);
  };

  const handlePrev = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };
  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25 text-center'>
          <h4>HR</h4>
          <hr />
          <div className='d-flex justify-content-between align-items-center'>
            <h5>Total:</h5>
            <span className='badge bg-primary'>{hrCount}</span>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25 text-center'>
          <h4>Employee</h4>
          <hr />
          <div className='d-flex justify-content-between align-items-center'>
            <h5>Total:</h5>
            <span className='badge bg-primary'>{employeeCount}</span>
          </div>
        </div>
      </div>

      {/* List of hr  */}
      <div className='mt-4 px-5 pt-3'>
        <h3>List of Admins</h3>
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Group</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {hrEmployees.map((hrEmployee, index) => (
              <tr key={index}>
                <td>{hrEmployee.email}</td>
                <td>{hrEmployee.group}</td>
                <td>{hrEmployee.name}</td>
                <td>Action</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pagination-wrapper'>
          <div className='pagination-buttons'>
            <button
              onClick={handlePrev}
              className='btn btn-primary me-2'
              disabled={pageNumber === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className='btn btn-primary'
              disabled={totalDocs / pageSize <= pageNumber}
            >
              Next
            </button>
          </div>

          <div className='page-info'>
            <h5>
              Page: {pageNumber} / {Math.ceil(totalDocs / pageSize)}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
