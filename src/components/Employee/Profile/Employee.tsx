/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface NormalEmployee {
  _id: string;
  email: string;
  group: string;
  name: string;
}

function Employee() {
  const [data, setData] = useState<NormalEmployee[]>([]);
  let token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}employees/all?group=normal`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        setData(res.data.employees);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Employee List</h3>
      </div>
      <Link to='/create' className='btn btn-success'>
        Add Employee
      </Link>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Attendance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => {
              return (
                <tr key={index}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>
                    <Link
                      to={`/attendance/employee/` + employee._id}
                      className='btn btn-primary btn-sm me-2'
                    >
                      Attendance
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/edit/` + employee._id}
                      className='btn btn-primary btn-sm me-2'
                    >
                      edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employee;
