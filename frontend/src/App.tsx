import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Results from './pages/Results';
import Certificate from './pages/Certificate';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
  const { initAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-warm-white font-body">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results/:analysisId" element={<Results />} />
          <Route path="/certificate/:analysisId" element={<Certificate />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          theme="light"
          toastClassName="font-body"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;

