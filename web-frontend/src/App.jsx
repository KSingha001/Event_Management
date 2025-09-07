import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import StudentEvents from './pages/StudentEvents';

function App(){
  return (
    <BrowserRouter>
      <div style={{padding:20}}>
        <nav>
          <Link to="/">Student</Link> | <Link to="/admin">Admin</Link>
        </nav>
        <Routes>
          <Route path="/" element={<StudentEvents />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
