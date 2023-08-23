import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar/Navbar';

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes></Routes>
      </Router>
    </>
  );
}

export default App;
