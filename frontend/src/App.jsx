import TransactionUpdates from './components/TransactionUpdates'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './components/login/Login'
import Register from './components/register/Register'
import { useAuth } from './hooks/useAuth'
import AdminDashboard from './components/AdminDashboard'
import CustomerDashboard from './components/CustomerDashboard'
import AdvisorDashboard from './components/AdvisorDashboard'
import Unauthorized from './components/Unauthorized'

function App() {
  const PrivateRoute = ({ children, requiredRole }) => {



    const { user, token, loading } = useAuth();
    // console.log(token);
    // console.log(localStorage.getItem('token'));

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!token) {
      return <Navigate to="/login" />;
    }

    if (user.role !== requiredRole) {
      return <Navigate to="/unauthorized" />;
    }

    return children;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/dashboard"
          element={
            <PrivateRoute requiredRole="customer">
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/advisor/dashboard"
          element={
            <PrivateRoute requiredRole="advisor">
              <AdvisorDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

export default App;
