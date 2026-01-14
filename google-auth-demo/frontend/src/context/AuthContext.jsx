import { createContext, useContext, useState } from 'react';
import { MOCK_USER } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginUser = (email, password) => {
    // For demo, accept any valid email with any password (min 6 chars)
    if (email && email.includes('@') && password && password.length >= 6) {
      setUser({ ...MOCK_USER, email });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const registerUser = (userData) => {
    setUser({ ...MOCK_USER, ...userData });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
