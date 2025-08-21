import React, { useState, useEffect } from 'react';
import { login } from '../api';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(true); // controla si se muestra el popup
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  if (!show) return null; // si se cierra, no renderiza nada

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div
        className="card shadow-lg p-4 position-relative"
        style={{ maxWidth: '400px', width: '100%', borderRadius: "15px", backgroundColor: "rgba(255,255,255,0.9)" }}
      >
        {/* Botón de cerrar */}
        <button
          onClick={() => {
            setShow(false);       // cierra el popup
            navigate("/");        // redirige a la página principal
          }}
          className="btn-close position-absolute top-0 end-0 m-3"
          aria-label="Close"
        ></button>

        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-danger small">{error}</p>}
          <button type="submit" className="btn btn-primary w-100">Sign in</button>
        </form>
        <div className="text-center mt-3">
          <span className="small">Not a member? </span>
          <a href="/register" className="text-decoration-none">Register</a>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
