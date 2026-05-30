import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'tenant' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await registerUser(form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account 🏠</h2>
        <p>Join NaiRent today</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Kamau"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label>I am signing up as:</label>
            <div className="role-selector">
              <label className={`role-option ${form.role === 'tenant' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="tenant"
                  checked={form.role === 'tenant'}
                  onChange={handleChange}
                />
                🔍 Tenant — looking for a place
              </label>
              <label className={`role-option ${form.role === 'landlord' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="landlord"
                  checked={form.role === 'landlord'}
                  onChange={handleChange}
                />
                🏠 Landlord — listing a property
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary btn-full">Create Account</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;