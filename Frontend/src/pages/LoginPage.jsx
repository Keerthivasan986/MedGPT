import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Banner from '../components/Banner.jsx';
import useAuth from '../hooks/useAuth.js';
import { apiErrorMessage } from '../utils/format.js';
import { ROLES } from '../utils/constants.js';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  async function submit(event) {
    event.preventDefault();
    setError(null);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === ROLES.PHARMACIST ? '/dashboard' : '/');
    } catch (err) {
      setError(apiErrorMessage(err, 'Login failed'));
    }
  }

  return (
    <div className="page narrow">
      <h2>Sign in</h2>
      <form className="stack" onSubmit={submit}>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <Banner type="error">{error}</Banner>
        <button type="submit">Sign in</button>
      </form>
      <p className="muted">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
