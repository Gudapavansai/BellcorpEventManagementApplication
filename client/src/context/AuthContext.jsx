import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/api/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error("Session check failed:", err.response?.data?.message || err.message);
          logout();
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  /**
   * LOGIN
   */
  const login = async (email, password) => {
    try {
      console.log("Attempting Login for:", email);
      const res = await axios.post('/api/auth/login', { email, password });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return { success: true };
      }
    } catch (err) {
      console.error("Login FULL Error:", err);
      if (!err.response) {
        return { success: false, message: 'Network Error: Cannot reach the backend. Please check if the Render URL is active.' };
      }
      const message = err.response?.data?.message || 'Server Error: Could not connect to the login service.';
      return { success: false, message };
    }
  };

  /**
   * REGISTER
   */
  const register = async (name, email, password) => {
    try {
      console.log("Attempting Registration for:", email);
      const res = await axios.post('/api/auth/register', { name, email, password });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return { success: true };
      }
    } catch (err) {
      console.error("Registration FULL Error:", err);
      if (!err.response) {
        return { success: false, message: 'Network Error: Database connection pending or Server unreachable.' };
      }
      const message = err.response?.data?.message || 'Server Error: Database might be offline or Email already taken.';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
