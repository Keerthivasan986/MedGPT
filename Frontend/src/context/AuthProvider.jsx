import { useEffect, useMemo, useState } from 'react';
import AuthContext from './AuthContext.js';
import { fetchCurrentUser, loginRequest, registerRequest } from '../api/auth.api.js';
import { TOKEN_KEY } from '../utils/constants.js';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    fetchCurrentUser()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(email, password) {
        const { token, user: loggedIn } = await loginRequest(email, password);
        localStorage.setItem(TOKEN_KEY, token);
        setUser(loggedIn);
        return loggedIn;
      },
      async register(payload) {
        const { token, user: created } = await registerRequest(payload);
        localStorage.setItem(TOKEN_KEY, token);
        setUser(created);
        return created;
      },
      logout() {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      }
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
