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
import UserOrders from "./pages/UserOrders";
import UserPayments from './pages/UserPayments';
import PaymentDetail from './pages/PaymentDetail';
import PaymentInvoice from './pages/PaymentInvoice';
import MenuCatalog from './pages/MenuCatalog';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NavBar from './components/NavBar';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    return user ? <>{children}</> : <Navigate to="/login" replace />;
};

import PageTransition from './components/PageTransition';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <div className="app-container">
                        <NavBar />
                        <CartPanel />

                        <main className="content">
                            <PageTransition>
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/" element={<Landing />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/admin/login" element={<AdminLogin />} />

                                    {/* Guarded Routes */}
                                    <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} /> 
                                    <Route path="/menu" element={<PrivateRoute><MenuCatalog /></PrivateRoute>} />
                                    <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
                                    <Route path="/payments/checkout" element={<PrivateRoute><PaymentCheckout /></PrivateRoute>} />
                                    <Route path="/payments/checkout/:orderId" element={<PrivateRoute><PaymentCheckout /></PrivateRoute>} />
                                    <Route path="/payments" element={<PrivateRoute><UserPayments /></PrivateRoute>} />
                                    <Route path="/orders" element={<PrivateRoute><UserOrders /></PrivateRoute>} />
                                    <Route path="/payments/:id" element={<PrivateRoute><PaymentDetail /></PrivateRoute>} />
                                    <Route path="/payments/:id/invoice" element={<PrivateRoute><PaymentInvoice /></PrivateRoute>} />
                                    
                                    {/* Admin Guarded (Assuming separate logic or just open for now) */}
                                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                </Routes>
                            </PageTransition>
                        </main>
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
