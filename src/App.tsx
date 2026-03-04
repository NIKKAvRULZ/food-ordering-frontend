import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>Identity Service</h1>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <p>SLIIT SE4010 - Current Trends in Software Engineering</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;