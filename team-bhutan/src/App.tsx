import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Features } from './pages/Features';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { KYC } from './pages/KYC';
import { Identity } from './pages/Identity';
import { Business } from './pages/Business';
import { BusinessServices } from './pages/BusinessServices';
import { Certificates } from './pages/Certificates';
import { Admin } from './pages/Admin';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/kyc" 
                  element={
                    <ProtectedRoute>
                      <KYC />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/identity" 
                  element={
                    <ProtectedRoute>
                      <Identity />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/business" 
                  element={
                    <ProtectedRoute>
                      <Business />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/business-services" 
                  element={
                    <ProtectedRoute>
                      <BusinessServices />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/certificates" 
                  element={
                    <ProtectedRoute>
                      <Certificates />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Layout>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                },
              }}
            />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;