import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar/Navbar';
import Login from './pages/login/login';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Home from './pages/home/Home';
import Dashboard from './components/Dashboard/dashboard';
import Employee from './components/Employee/Profile/Employee';
import AddEmployee from './components/Employee/AddEmployee/AddEmployee';
import EditEmployee from './components/Employee/EditEmployee/EditEmployee';

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Dashboard />}>
            <Route path='' element={<Home />} />
            <Route path='employee' element={<Employee />} />
            <Route path='create' element={<AddEmployee />} />
            <Route path='edit/:id' element={<EditEmployee />} />
          </Route>
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
