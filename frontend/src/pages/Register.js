import React, { useState, useEffect } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Si está logueado, redirige al home o dashboard
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register({ name, email, password });
      setSuccess('Usuario registrado correctamente');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Nombre completo"
    className="form-control mb-2"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />
  <input
    type="email"
    placeholder="Correo electrónico"
    className="form-control mb-2"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  <input
    type="password"
    placeholder="Contraseña"
    className="form-control mb-2"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <input
    type="password"
    placeholder="Confirmar contraseña"
    className="form-control mb-2"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
  />

  {error && <p className="text-danger small">{error}</p>}
  {success && <p className="text-success small">{success}</p>}

  <button type="submit" className="btn btn-primary w-100">
    Register
  </button>
</form>

        <div className="text-center mt-3">
          <span className="small">Already have an account? </span>
          <a href="/login" className="text-decoration-none">Login</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
