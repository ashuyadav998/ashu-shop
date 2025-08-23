import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name || '',
        email: storedUser.email || '',
        phone: storedUser.phone || ''
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al cambiar la contraseña');

      alert(data.message);
      setShowPasswordPopup(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.")) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Tu cuenta ha sido eliminada exitosamente.');
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(`Error al eliminar la cuenta: ${errorData.message}`);
      }
    } catch (error) {
      alert('Ocurrió un error de red. Intenta de nuevo más tarde.');
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <h2 className="mb-4 text-center">Perfil de Usuario</h2>

            {/* Información Personal */}
            <div className="mb-4 border-bottom pb-3">
              <h4 className="card-title">Información Personal</h4>
              <p><strong>Nombre:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Teléfono:</strong> {user.phone || 'N/A'}</p>
            </div>

            {/* Botón para abrir pop-up */}
            <div className="mb-4 border-bottom pb-3">
              <h4 className="card-title">Cambiar Contraseña</h4>
              <button
                className="btn btn-primary w-100"
                onClick={() => setShowPasswordPopup(true)}
              >
                Cambiar Contraseña
              </button>
            </div>

            {/* Pop-up */}
            {showPasswordPopup && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000
                }}
              >
                <div
                  style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '8px',
                    minWidth: '300px'
                  }}
                >
                  <h4>Cambiar Contraseña</h4>
                  <form onSubmit={handleChangePassword}>
                    <div className="mb-3">
                      <label htmlFor="currentPassword" className="form-label">Contraseña Actual</label>
                      <input
                        type="password"
                        className="form-control"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-2">Guardar</button>
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={() => setShowPasswordPopup(false)}
                    >
                      Cancelar
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Eliminar Cuenta */}
            <div>
              <h4 className="card-title text-danger">Eliminar Cuenta</h4>
              <p className="text-muted">Esta acción es irreversible y eliminará permanentemente todos tus datos.</p>
              <button
                className="btn btn-outline-danger w-100"
                onClick={handleDeleteAccount}
              >
                Eliminar Cuenta
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
