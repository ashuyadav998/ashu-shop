import React from 'react';

function Perfil() {
  // Recupera los datos del usuario desde localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <p>No hay datos de usuario. Por favor, inicia sesión.</p>;
  }

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{maxWidth: '400px'}}>
        <h2 className="mb-4 text-center">Perfil de Usuario</h2>
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Puedes mostrar más datos si los tienes */}
      </div>
    </div>
  );
}

export default Perfil;