/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './attendance.css';
import AttendanceDocument from '../../Document/AttendanceDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';

interface AttendanceInterface {
  _id: string;
  date: string;
  status: string;
  signInTime: string;
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
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  let token = localStorage.getItem('token');

  const { id: employeeId } = useParams<{ id: string }>();

  const loadAttendances = () => {
    setIsLoading(true);
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
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
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
      setIsDeleting(true);
      await axios.delete(
        `${process.env.REACT_APP_BASE_API_URL}attendance/delete/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setData(data.filter((item) => item._id !== id));
      setIsDeleting(false);
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
        className='btn btn-success me-2'
      >
        Add Attendance
      </Link>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {employeeData && data && (
          <PDFDownloadLink
            document={
              <AttendanceDocument
                attendances={data}
                email={employeeData.email}
                name={employeeData.name}
              />
            }
            fileName='attendance.pdf'
          >
            {({ blob, url, loading, error }) =>
              loading ? 'Loading document...' : 'Download attendance'
            }
          </PDFDownloadLink>
        )}
      </div>

      {isLoading ? (
        <div className='spinner-container'>
          <div className='loading-indicator'></div>
        </div>
      ) : (
        <div className='mt-3'>
          <table className='table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Sign-In</th>
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
                      <td>{attendance.signInTime}</td>
                      <td>
                        <Link
                          to={`/attendance/update/${attendance._id}`}
                          className='btn btn-primary btn-sm me-2'
                        >
                          Edit
                        </Link>
                        <button
                          className='remove-button'
                          onClick={() => handleDelete(attendance._id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'deleting...' : 'delete'}
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
      )}
    </div>
  );
}
export default Attendance;
