import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartPanel from './components/CartPanel';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import PaymentCheckout from './pages/PaymentCheckout';
import UserPayments from './pages/UserPayments';
import PaymentDetail from './pages/PaymentDetail';
import PaymentInvoice from './pages/PaymentInvoice';
import MenuCatalog from './pages/MenuCatalog';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NavBar from './components/NavBar';
import './App.css';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <div className="app-container">
                        <NavBar />
                        <CartPanel />

                        <main className="content">
                            <Routes>
                                <Route path="/" element={<Landing />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/home" element={<Home />} /> 
                                <Route path="/menu" element={<MenuCatalog />} />
                                <Route path="/profile/:id" element={<Profile />} />
                                <Route path="/payments/checkout" element={<PaymentCheckout />} />
                                <Route path="/payments/checkout/:orderId" element={<PaymentCheckout />} />
                                <Route path="/payments" element={<UserPayments />} />
                                <Route path="/payments/:id" element={<PaymentDetail />} />
                                <Route path="/payments/:id/invoice" element={<PaymentInvoice />} />
                                <Route path="/admin/login" element={<AdminLogin />} />
                                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            </Routes>
                        </main>
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;