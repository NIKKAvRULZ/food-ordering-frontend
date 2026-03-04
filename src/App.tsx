import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; // Now being used below
import Profile from './pages/Profile';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <nav className="navbar">
            <div className="brand-text">Gourmet.Express</div>
            <div className="nav-links" style={{ display: 'flex', gap: '30px' }}>
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Network</Link>
              <Link to="/login" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
              <Link to="/register" className="btn-gold" style={{ padding: '8px 20px' }}>Join</Link>
            </div>
          </nav>

          <main className="content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} /> 
              <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;