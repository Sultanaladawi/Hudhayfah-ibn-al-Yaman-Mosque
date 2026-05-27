import { useState, useEffect, useCallback } from 'react';

export function useAdminAuth() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin_session');
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (e) {
        localStorage.removeItem('admin_session');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setError('');
    setLoading(true);

    const checkLocalUser = () => {
      const savedSheikhs = localStorage.getItem('sheikhs_list');
      let customTeam = [];
      if (savedSheikhs) {
        try {
          customTeam = JSON.parse(savedSheikhs);
        } catch(e) {}
      }
      const team = [
        { email: 'osama@huzaifa-mosque.com', pass: 'osama123', name: 'الشيخ أسامة الطراونة', role: 'super_admin' },
        { email: 'hammam@huzaifa-mosque.com', pass: 'hammam123', name: 'الشيخ همام البلاونة', role: 'super_admin' },
        { email: 'baker@huzaifa-mosque.com', pass: 'baker123', name: 'الشيخ بكر الخالدي', role: 'admin' },
        ...customTeam
      ];
      return team.find(u => u.email === email.toLowerCase().trim() && u.pass === password);
    };

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const adminData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role
        };

        setAdmin(adminData);
        localStorage.setItem('admin_session', JSON.stringify(adminData));
        setLoading(false);
        return true;
      } else {
        const localUser = checkLocalUser();
        if (localUser) {
          const fallbackData = { 
            id: `local-${localUser.name}`, 
            email: localUser.email, 
            name: localUser.name, 
            role: localUser.role 
          };
          setAdmin(fallbackData);
          localStorage.setItem('admin_session', JSON.stringify(fallbackData));
          setLoading(false);
          return true;
        }
        setError(data.message || 'Invalid email or password.');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.warn("Backend unreachable. Triggering local fallback mode.");
      const localUser = checkLocalUser();
      if (localUser) {
        const fallbackData = { 
          id: `local-${localUser.name}`, 
          email: localUser.email, 
          name: localUser.name, 
          role: localUser.role 
        };
        setAdmin(fallbackData);
        localStorage.setItem('admin_session', JSON.stringify(fallbackData));
        setLoading(false);
        return true;
      }

      setError('Connection error or invalid credentials.');
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_session');
    setAdmin(null);
  }, []);

  return { admin, loading, error, login, logout, isAdmin: !!admin };
}
