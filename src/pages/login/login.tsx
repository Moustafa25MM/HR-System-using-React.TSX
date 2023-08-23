import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useDispatch } from 'react-redux';
import { login } from '../../store/auth/login';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(5, 'Password must be at least 8 characters long')
      .max(16, 'Password must not exceed 16 characters'),
  });

  const onSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}login/`,
        values
      );
      console.log(response);
      if (!response.data.token) {
        toast.error('Invalid username or password', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      if (response.data.error) {
        switch (response.data.error) {
          case 'Invalid email or password':
            toast.error('Invalid email or password', {
              position: toast.POSITION.TOP_RIGHT,
            });
            break;
          case 'Access denied':
            toast.error('Access denied', {
              position: toast.POSITION.TOP_RIGHT,
            });
            break;
          default:
            toast.error('An unknown error occurred', {
              position: toast.POSITION.TOP_RIGHT,
            });
        }
      }
      localStorage.setItem('token', response.data.token);
      toast.success('Login Successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate('/');
      dispatch(login());
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError.response?.status);
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 401:
            toast.error('Invalid email or password', {
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
      } else if (axiosError.request) {
        toast.error('No response received from the server', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error('An error occurred', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className='flex flex-col items-center justify-center py-8'>
            <h1 className='text-4xl font-bold text-gray-800 mb-4'>Login</h1>
          </div>
          <div className='container mx-auto mt-8 px-4 mb-16'>
            <div className='max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md'>
              <div className='py-4 px-6'>
                <div className='mb-4'>
                  <label
                    className='block text-gray-700 font-bold mb-2'
                    htmlFor='email'
                  >
                    Email
                  </label>
                  <Field
                    className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Email'
                  />
                  <ErrorMessage
                    className='text-red-500 text-xs italic'
                    name='email'
                    component='p'
                  />
                </div>
                <div className='mb-6'>
                  <label
                    className='block text-gray-700 font-bold mb-2'
                    htmlFor='password'
                  >
                    Password
                  </label>

                  <Field
                    className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='password'
                    name='password'
                    id='password'
                    placeholder='Password'
                  />
                  <ErrorMessage
                    className='text-red-500 text-xs italic'
                    name='password'
                    component='p'
                  />
                </div>
                <button
                  className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full'
                  type='submit'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Log in'}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
