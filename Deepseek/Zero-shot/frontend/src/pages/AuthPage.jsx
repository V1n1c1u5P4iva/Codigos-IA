import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login.jsx';
import Register from '../components/Register.jsx';
import { api } from '../api';
import { saveSession } from '../auth';

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin({ username, password }) {
    setError('');
    setLoading(true);
    try {
      const data = await api.login(username, password);
      saveSession(data.access_token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister({ username, email, password }) {
    setError('');
    setLoading(true);
    try {
      const data = await api.register({ username, email, password });
      saveSession(data.access_token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <h1 style={{ textAlign: 'center' }}>Task Manager</h1>
      {mode === 'register' ? (
        <Register onSubmit={handleRegister} error={error} loading={loading} />
      ) : (
        <Login onSubmit={handleLogin} error={error} loading={loading} />
      )}
    </div>
  );
}