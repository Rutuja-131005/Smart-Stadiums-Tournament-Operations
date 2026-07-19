import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const defaultUser = {
  _id: "660000000000000000000001",
  name: "Tournament Administrator",
  email: "admin@worldcup2026.com",
  role: "admin",
  preferredLanguage: "en",
  accessibilitySettings: {
    highContrast: false,
    largeText: false,
    screenReaderOptimized: false
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);
  const [loading, setLoading] = useState(false);

  const loadUser = useCallback(async () => {
    // Bypassed: user is always logged in as admin
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    setUser(defaultUser);
    return defaultUser;
  };

  const register = async (formData) => {
    setUser(defaultUser);
    return defaultUser;
  };

  const logout = () => {
    // Simply redirect to landing page without clearing user session
    window.location.href = '/';
  };

  const updateAccessibility = async (settings) => {
    const updated = { ...user, accessibilitySettings: { ...user.accessibilitySettings, ...settings } };
    setUser(updated);
    return updated;
  };

  const updateLanguage = async (language) => {
    const updated = { ...user, preferredLanguage: language };
    setUser(updated);
    return updated;
  };

  const hasRole = (...roles) => true; // Admin bypasses all checks!

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateAccessibility, updateLanguage, hasRole, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
