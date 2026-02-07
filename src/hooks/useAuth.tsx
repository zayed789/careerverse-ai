import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('careerverse_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('careerverse_user');
      }
    }
    setLoading(false);
  }, []);

  const signUp = (name, email, password) => {
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: 'Student',
      avatar: null,
      domain: '',
      skills: [],
      experience: 'Beginner',
      preferredRole: '',
      learningGoals: '',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('careerverse_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const signIn = (email, password) => {
    const stored = localStorage.getItem('careerverse_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.email === email) {
        setUser(parsed);
        return parsed;
      }
    }
    // Simulate login for any email
    const simulatedUser = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role: 'Student',
      avatar: null,
      domain: '',
      skills: [],
      experience: 'Beginner',
      preferredRole: '',
      learningGoals: '',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('careerverse_user', JSON.stringify(simulatedUser));
    setUser(simulatedUser);
    return simulatedUser;
  };

  const signOut = () => {
    localStorage.removeItem('careerverse_user');
    setUser(null);
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('careerverse_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
