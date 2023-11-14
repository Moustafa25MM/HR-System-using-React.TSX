import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddEmployee() {
  const [errors, setErrors] = useState({ name: '', password: '', email: '' });

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    group: 'Normal Employee',
    netSalary: '',
    grossSalary: '',
    task: '',
  });
  const navigate = useNavigate();
  let token = localStorage.getItem('token');

  const handleBlurName = () => {
    if (data.name.length < 5) {
      setErrors({
        ...errors,
        name: 'Name should be at least 5 characters long',
      });
    } else {
      setErrors({ ...errors, name: '' });
    }
  };

  const handleBlurPassword = () => {
    if (data.password.length < 5) {
      setErrors({
        ...errors,
        password: 'Password should be at least 5 characters long',
      });
    } else {
      setErrors({ ...errors, password: '' });
    }
  };
  const handleBlurEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setErrors({ ...errors, email: 'Invalid email format' });
    } else {
      setErrors({ ...errors, email: '' });
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append('name', data.name);
    formdata.append('email', data.email);
    formdata.append('password', data.password);
    formdata.append('group', data.group);
    formdata.append('netSalary', data.netSalary);
    formdata.append('grossSalary', data.grossSalary);
    formdata.append('task', data.task);

    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}employees/create`, formdata, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        toast.success('Employee Successfully Added', {
          position: toast.POSITION.TOP_RIGHT,
        });
        navigate('/employee');
      })
      .catch((error) => {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          switch (axiosError.response.status) {
            case 400:
              toast.error('Email already Exists', {
                position: toast.POSITION.TOP_RIGHT,
              });
              break;
            case 403:
              toast.error('Access Denied', {
                position: toast.POSITION.TOP_RIGHT,
              });
              break;
            default:
              toast.error('An unknown error occurred', {
                position: toast.POSITION.TOP_RIGHT,
              });
          }
        }
        console.log(axiosError);
      });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      data.name.length >= 5 &&
      data.password.length >= 5 &&
      emailRegex.test(data.email)
    );
  };

  return (
    <div className='d-flex flex-column align-items-center pt-4'>
      <h2>Add Employee</h2>
      <form className='row g-3 w-50' onSubmit={handleSubmit}>
        <div className='col-12'>
          <label htmlFor='inputName' className='form-label'>
            Name
          </label>
          <input
            type='text'
            className='form-control'
            id='inputName'
            placeholder='Enter Name'
            autoComplete='off'
            onBlur={handleBlurName}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          {data.name.length > 0 && data.name.length < 5 && (
            <small id='nameHelp' className='form-text text-danger'></small>
          )}
          {errors.name && <div className='text-danger'>{errors.name}</div>}
        </div>

        <div className='col-12'>
          <label htmlFor='inputEmail4' className='form-label'>
            Email
          </label>
          <input
            type='email'
            className='form-control'
            id='inputEmail4'
            placeholder='Enter Email'
            autoComplete='off'
            onBlur={handleBlurEmail}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          {data.email.length > 0 && data.email.length < 5 && (
            <small id='nameHelp' className='form-text text-danger'></small>
          )}
          {errors.email && <div className='text-danger'>{errors.email}</div>}
        </div>
        <div className='col-12'>
          <label htmlFor='inputGroup' className='form-label'>
            Group
          </label>
          <input
            type='text'
            className='form-control'
            id='inputGroup'
            placeholder='Enter Group'
            value={data.group}
            readOnly
          />
        </div>
        <div className='col-12'>
          <label htmlFor='inputPassword4' className='form-label'>
            Password
          </label>
          <input
            type='password'
            className='form-control'
            id='inputPassword4'
            placeholder='Enter Password'
            onBlur={handleBlurPassword}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          {data.password.length > 0 && data.password.length < 5 && (
            <small id='nameHelp' className='form-text text-danger'></small>
          )}
          {errors.password && (
            <div className='text-danger'>{errors.password}</div>
          )}
        </div>
        <div className='col-12'>
          <label htmlFor='inputNetSalary' className='form-label'>
            Net Salary
          </label>
          <input
            type='number'
            className='form-control'
            id='inputNetSalary'
            placeholder='Enter Net Salary'
            autoComplete='off'
            onChange={(e) => setData({ ...data, netSalary: e.target.value })}
          />
        </div>
        <div className='col-12'>
          <label htmlFor='inputGrossSalary' className='form-label'>
            Gross Salary
          </label>
          <input
            type='number'
            className='form-control'
            id='inputGrossSalary'
            placeholder='Enter Gross Salary'
            autoComplete='off'
            onChange={(e) => setData({ ...data, grossSalary: e.target.value })}
          />
        </div>
        <div className='col-12'>
          <label htmlFor='inputTask' className='form-label'>
            Task
          </label>
          <select
            className='form-control'
            id='inputTask'
            onChange={(e) => setData({ ...data, task: e.target.value })}
          >
            <option value=''>Select Task</option>
            <option value='Frontend'>Frontend</option>
            <option value='Backend'>Backend</option>
            <option value='Devops'>Devops</option>
            <option value='Software'>Software</option>
          </select>
        </div>
        <div className='col-12'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={!validateForm()}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployee;
