/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalDocs, setTotalDocs] = useState(0);

  let token = localStorage.getItem('token');

  const { id: employeeId } = useParams<{ id: string }>();

  const loadAttendances = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}attendance/employee/${employeeId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        setData(res.data.attendance);
        setTotalDocs(res.data.pagination.totalDocs);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadAttendances();
  }, [pageNumber]);
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

  async function handleDelete(id: string) {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_API_URL}attendance/delete/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setData(data.filter((item) => item._id !== id));
      toast.success('Attendance deleted successfully!');
    } catch (err) {
      console.log(err);
    }
  }
  const handleNext = () => {
    setPageNumber(pageNumber + 1);
  };

  const handlePrev = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Attendance List</h3>
      </div>
      <div className='d-flex flex-column justify-content-center align-items-center mt-2 bg-light p-3 rounded shadow'>
        <h3 className='m-0'>{employeeData?.email}</h3>
        <h3 className='m-0 mt-2'>{employeeData?.name}</h3>
      </div>
      <Link
        to={`/add/attendance/` + employeeData?._id}
        className='btn btn-success'
      >
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
                        to={`/attendance/update/${attendance._id}`}
                        className='btn btn-primary btn-sm me-2'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(attendance._id)}
                        className='btn btn-danger btn-sm'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
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
}
export default Attendance;
