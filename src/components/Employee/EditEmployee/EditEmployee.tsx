/* eslint-disable react-hooks/exhaustive-deps */
import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditEmployee() {
  const [errors, setErrors] = useState({ name: '', email: '' });

  let token = localStorage.getItem('token');
  const [data, setData] = useState({
    name: '',
    email: '',
  });
  const navigate = useNavigate();

  const { id } = useParams();
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
  const handleBlurEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setErrors({ ...errors, email: 'Invalid email format' });
    } else {
      setErrors({ ...errors, email: '' });
    }
  };
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return data.name.length >= 5 && emailRegex.test(data.email);
  };
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}employees/emp/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        setData({
          ...data,
          name: res.data.Result[0].name,
          email: res.data.Result[0].email,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    axios
      .patch(
        `${process.env.REACT_APP_BASE_API_URL}employees/profile/${id}`,
        data,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success('Employee Successfully Updated', {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate('/employee');
        }
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
  return (
    <div className='d-flex flex-column align-items-center pt-4'>
      <h2>Update Employee</h2>
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
            value={data.name}
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
            value={data.email}
          />
          {data.email.length > 0 && data.email.length < 5 && (
            <small id='nameHelp' className='form-text text-danger'></small>
          )}
          {errors.email && <div className='text-danger'>{errors.email}</div>}
        </div>
        <div className='col-12'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={!validateForm()}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEmployee;
