/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface AttendanceInterface {
  _id: string;
  date: string;
  status: string;
}
interface NormalEmployee {
  _id: string;
  email: string;
  group: string;
  name: string;
}

function Attendance() {
  const [data, setData] = useState<AttendanceInterface[]>([]);
  const [employeeData, setEmployeeData] = useState<NormalEmployee | null>(null);

  let token = localStorage.getItem('token');

  const { id: employeeId } = useParams<{ id: string }>();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}attendance/employee/${employeeId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}employees/emp/${employeeId}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        setEmployeeData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Attendance List</h3>
      </div>
      <div className='d-flex flex-column justify-content-center align-items-center mt-2 bg-light p-3 rounded shadow'>
        <h3 className='m-0'>{employeeData?.email}</h3>
        <h3 className='m-0 mt-2'>{employeeData?.name}</h3>
      </div>
      <Link to='/create' className='btn btn-success'>
        Add Attendance
      </Link>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((attendance, index) => {
                const date = new Date(attendance.date);
                const formattedDate = `${date.getDate()}-${
                  date.getMonth() + 1
                }-${date.getFullYear()}`;
                return (
                  <tr key={index}>
                    <td>{formattedDate}</td>
                    <td>{attendance.status}</td>
                    <td>
                      <Link
                        to={`/attendance/employee/`}
                        className='btn btn-primary btn-sm me-2'
                      >
                        Edit
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
export default Attendance;
