import React, { useState, useEffect } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register({ name, email, password });
      toast.success('Usuario registrado correctamente');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => navigate('/login'), 2000); // redirige tras 2s
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
      toast.error(err.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div 
        className="card shadow-lg p-4 position-relative"
        style={{ maxWidth: '400px', width: '100%', borderRadius: "15px", backgroundColor: "rgba(255,255,255,0.95)" }}
      >
        {/* Botón de cerrar */}
        <button 
          onClick={() => navigate("/")}
          className="btn-close position-absolute top-0 end-0 m-3"
          aria-label="Close"
        ></button>

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

          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>

        <div className="text-center mt-3">
          <span className="small">Already have an account? </span>
          <a href="/login" className="text-decoration-none">Login</a>
        </div>
      </div>

      {/* ToastContainer necesario para mostrar los toasts */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
}

export default RegisterForm;
