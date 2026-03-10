import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; // Now being used below
import Profile from './pages/Profile';
import PaymentCheckout from './pages/PaymentCheckout';
import UserPayments from './pages/UserPayments';
import PaymentDetail from './pages/PaymentDetail';
import PaymentInvoice from './pages/PaymentInvoice';
import NavBar from './components/NavBar';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <NavBar />

          <main className="content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} /> 
              <Route path="/profile/:id" element={<Profile />} />
              {/* Payment Service — Susara */}
              <Route path="/payments/checkout" element={<PaymentCheckout />} />
              <Route path="/payments/checkout/:orderId" element={<PaymentCheckout />} />
              <Route path="/payments" element={<UserPayments />} />
              <Route path="/payments/:id" element={<PaymentDetail />} />
              <Route path="/payments/:id/invoice" element={<PaymentInvoice />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;