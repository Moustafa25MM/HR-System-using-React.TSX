/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import EmployeeDocument from '../../Document/EmployeeDocument';

interface NormalEmployee {
  _id: string;
  email: string;
  group: string;
  name: string;
  netSalary: number;
  grossSalary: number;
  task: string;
}

function Employee() {
  const [data, setData] = useState<NormalEmployee[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalDocs, setTotalDocs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  let token = localStorage.getItem('token');

  const loadNormalEmpolyee = () => {
    setIsLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}employees/all?group=normal&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        setData(res.data.employees);
        setTotalDocs(res.data.pagination.totalDocs);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    loadNormalEmpolyee();
  }, [pageNumber]);

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
      <PDFDownloadLink
        document={<EmployeeDocument employees={data} />}
        fileName='employees.pdf'
      >
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Download PDF'
        }
      </PDFDownloadLink>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Employee List</h3>
      </div>
      <Link to='/create' className='btn btn-success'>
        Add Employee
      </Link>

      {isLoading ? (
        <div className='spinner-container'>
          <div className='loading-indicator'></div>
        </div>
      ) : (
        <div className='mt-3'>
          <table className='table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Net Salary</th>
                <th>Gross Salary</th>
                <th>Attendance</th>
                <th>Action</th>
                <th>Task</th>
              </tr>
            </thead>
            <tbody>
              {data.map((employee, index) => {
                return (
                  <tr key={index}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.netSalary}</td>
                    <td>{employee.grossSalary}</td>
                    <td>
                      <Link
                        to={`/attendance/employee/` + employee._id}
                        className='btn btn-info btn-sm me-2'
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
                    <td>{employee.task}</td>
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

export default Employee;
