import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../components/Banner.jsx';
import useAuth from '../hooks/useAuth.js';
import { fetchPharmacies } from '../api/pharmacy.api.js';
import { apiErrorMessage } from '../utils/format.js';
import { ROLES } from '../utils/constants.js';

const EMPTY_FORM = { name: '', email: '', phone: '', password: '', role: ROLES.PATIENT, pharmacyId: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPharmacies().then(setPharmacies).catch(() => {});
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError(null);
    try {
      const user = await register(form);
      navigate(user.role === ROLES.PHARMACIST ? '/dashboard' : '/');
    } catch (err) {
      setError(apiErrorMessage(err, 'Registration failed'));
    }
  }

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  return (
    <div className="page narrow">
      <h2>Create account</h2>
      <form className="stack" onSubmit={submit}>
        <label>
          Full name
          <input value={form.name} onChange={update('name')} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={update('email')} required />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={update('phone')} />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={update('password')} minLength={6} required />
        </label>
        <label>
          I am a
          <select value={form.role} onChange={update('role')}>
            <option value={ROLES.PATIENT}>Patient</option>
            <option value={ROLES.PHARMACIST}>Pharmacist</option>
          </select>
        </label>
        {form.role === ROLES.PHARMACIST && (
          <label>
            Pharmacy
            <select value={form.pharmacyId} onChange={update('pharmacyId')} required>
              <option value="">Select a pharmacy</option>
              {pharmacies.map((pharmacy) => (
                <option key={pharmacy._id} value={pharmacy._id}>
                  {pharmacy.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <Banner type="error">{error}</Banner>
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}
