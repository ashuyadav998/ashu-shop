import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    // Fetch user data from localStorage or your API
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData({ 
        name: storedUser.name || '', 
        email: storedUser.email || '', 
        phone: storedUser.phone || '' 
      });
    } else {
      // Redirect to login if no user is found
      navigate('/login');
    }
  }, [navigate]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    // Logic to update user info on the backend
    console.log('Updating user info:', formData);
    // You would make a PUT request to your API here
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    // Logic to change password on the backend
    console.log('Changing password:', passwordData);
    // You would make a PUT request to your API here
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.")) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          alert('Tu cuenta ha sido eliminada exitosamente.');
          navigate('/login');
        } else {
          const errorData = await response.json();
          alert(`Error al eliminar la cuenta: ${errorData.message}`);
        }
      } catch (error) {
        alert('Ocurrió un error de red. Intenta de nuevo más tarde.');
      }
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <h2 className="mb-4 text-center">Perfil de Usuario</h2>
            
            {/* Display User Info */}
            <div className="mb-4 border-bottom pb-3">
              <h4 className="card-title">Información Personal</h4>
              <p><strong>Nombre:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Teléfono:</strong> {user.phone || 'N/A'}</p>
            </div>

            {/* Change Password Form */}
            <div className="mb-4 border-bottom pb-3">
              <h4 className="card-title">Cambiar Contraseña</h4>
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
                <button type="submit" className="btn btn-primary w-100">Guardar Contraseña</button>
              </form>
            </div>
            
            {/* Delete Account Section */}
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