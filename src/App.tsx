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
import AddAttendance from './components/Attendance/AddAttendance/AddAttendance';
import Attendance from './components/Attendance/ListAttendance/Attendance';
import EditAttendance from './components/Attendance/EditAttendance/EditAttendance';
import NotFound from './components/NotFound/NotFound';

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
            <Route path='attendance/employee/:id' element={<Attendance />} />
            <Route path='add/attendance/:id' element={<AddAttendance />} />
            <Route path='attendance/update/:id' element={<EditAttendance />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
