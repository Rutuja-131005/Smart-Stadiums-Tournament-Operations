import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const simulatedUsers = {
  admin: {
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
  },
  staff: {
    _id: "660000000000000000000002",
    name: "Command Center Staff",
    email: "staff@worldcup2026.com",
    role: "staff",
    preferredLanguage: "en",
    accessibilitySettings: {
      highContrast: false,
      largeText: false,
      screenReaderOptimized: false
    }
  },
  security: {
    _id: "660000000000000000000003",
    name: "Security Officer",
    email: "security@worldcup2026.com",
    role: "security",
    preferredLanguage: "en",
    accessibilitySettings: {
      highContrast: false,
      largeText: false,
      screenReaderOptimized: false
    }
  },
  volunteer: {
    _id: "660000000000000000000004",
    name: "Event Volunteer",
    email: "volunteer@worldcup2026.com",
    role: "volunteer",
    preferredLanguage: "en",
    accessibilitySettings: {
      highContrast: false,
      largeText: false,
      screenReaderOptimized: false
    }
  },
  fan: {
    _id: "660000000000000000000005",
    name: "Stadium Fan",
    email: "fan@worldcup2026.com",
    role: "fan",
    preferredLanguage: "en",
    accessibilitySettings: {
      highContrast: false,
      largeText: false,
      screenReaderOptimized: false
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('simulated_role') || 'admin';
    return simulatedUsers[savedRole] || simulatedUsers.admin;
  });
  const [loading, setLoading] = useState(false);

  const loadUser = useCallback(async () => {
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    return user;
  };

  const register = async (formData) => {
    return user;
  };

  const logout = () => {
    window.location.href = '/';
  };

  const switchRole = (newRole) => {
    const selected = simulatedUsers[newRole] || simulatedUsers.admin;
    setUser(selected);
    localStorage.setItem('simulated_role', newRole);
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

  const hasRole = (...roles) => true; // All roles are open accessible!

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateAccessibility, updateLanguage, hasRole, loadUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
