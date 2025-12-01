import React, { useState } from 'react';
import { Avatar } from 'primereact/avatar';
import Icon from '@mdi/react';
import {
  mdiMenuDown,
  mdiMenuUp,
  mdiArrowLeft,
  mdiHeadset, // Icono para soporte
} from '@mdi/js';

// Datos simulados de usuarios
const usersData = [
  {
    id: 1,
    name: 'Ignacio Sánchez',
    avatar: 'https://primefaces.org/cdn/primereact/images/avatar/ivanmagalhaes.png',
    role: 'user',
  },
  {
    id: 2,
    name: 'Soporte',
    avatar: null, // null para usar icono
    role: 'support',
  },
];

// Datos simulados de mensajes
const messagesData = [
  { id: 1, sender: 'Ignacio Sánchez', date: '16/11/2025 10:22', text: 'Estoy llegando al punto de encuentro.' },
  { id: 2, sender: 'Ignacio Sánchez', date: '16/11/2025 10:25', text: 'Llegué.' },
  { id: 3, sender: 'Yo', date: '16/11/2025 10:26', text: 'Gracias!' },
];

export default function Messages() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Manejador de selección de usuario (Toggle)
  const handleUserClick = (id) => {
    if (selectedUserId === id) {
      setSelectedUserId(null); // Regresar a Inicio si es el mismo
    } else {
      setSelectedUserId(id);
    }
  };

  // Encontrar usuario activo
  const activeUser = usersData.find((u) => u.id === selectedUserId);

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* --- COLUMNA IZQUIERDA (Lista de Usuarios) --- */}
        <div className="col-12 col-lg-4">
          {/* Header del Sidebar (Toggle) */}
          <div className="d-flex align-items-center gap-3 mb-3 cursor-pointer user-select-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ cursor: 'pointer' }}>
            <Icon path={isSidebarOpen ? mdiMenuDown : mdiMenuUp} size={1} />
            <h5 className="fw-normal mb-0">Mensajes directos</h5>
          </div>

          {/* Lista de Usuarios (Con animación CSS) */}
          <div
            style={{
              maxHeight: isSidebarOpen ? '500px' : '0',
              opacity: isSidebarOpen ? 1 : 0,
              overflow: 'hidden',
              transition: 'all 0.4s ease-in-out',
            }}
          >
            <div className="d-flex flex-column gap-3">
              {usersData.map((user) => {
                const isActive = selectedUserId === user.id;

                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="card border shadow-sm p-3 d-flex flex-row align-items-center gap-3"
                    style={{
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      // Estilos condicionales para el activo
                      backgroundColor: isActive ? '#e0f7fa' : '#fff', // Fondo cyan claro si está activo
                      borderColor: isActive ? 'var(--color-cyan-tint-2)' : '#dee2e6',
                    }}
                  >
                    {/* Avatar Condicional */}
                    {user.role === 'support' ? (
                      <div className="rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '40px', height: '40px', backgroundColor: '#fff' }}>
                        {/* Icono de VeloCity o Soporte */}
                        <Icon path={mdiHeadset} size={1} color="var(--color-teal-tint-1)" />
                      </div>
                    ) : (
                      <Avatar image={user.avatar} shape="circle" size="normal" />
                    )}

                    <span className="fw-bold text-dark">{user.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA (Contenido Principal) --- */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', minHeight: '600px', backgroundColor: '#fcf7ff' }}>
            {/* VISTA 1: INICIO (Cuando no hay usuario seleccionado) */}
            {!selectedUserId && (
              <div className="card-body p-4">
                <h5 className="mb-3">Inicio</h5>
                <hr className="text-muted opacity-25 mb-5" />

                <div className="d-flex justify-content-center align-items-center h-100 mt-5">
                  <div className="py-4 px-5 text-center" style={{ backgroundColor: '#dfe6e9', borderRadius: '8px', width: '80%' }}>
                    <span className="text-dark">No tienes mensajes sin leer.</span>
                  </div>
                </div>
              </div>
            )}

            {/* VISTA 2: CHAT (Cuando hay usuario seleccionado) */}
            {selectedUserId && activeUser && (
              <div className="card-body p-0 d-flex flex-column" style={{ height: '600px' }}>
                {/* Header del Chat */}
                <div className="p-4 border-bottom d-flex align-items-center gap-3">
                  <div onClick={() => setSelectedUserId(null)} style={{ cursor: 'pointer' }}>
                    <Icon path={mdiArrowLeft} size={1.2} className="text-dark" />
                  </div>

                  {activeUser.role === 'support' ? (
                    <div className="rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '40px', height: '40px', backgroundColor: '#fff' }}>
                      <Icon path={mdiHeadset} size={1} color="var(--color-teal-tint-1)" />
                    </div>
                  ) : (
                    <Avatar image={activeUser.avatar} shape="circle" size="normal" />
                  )}

                  <h5 className="mb-0 fw-normal">{activeUser.name}</h5>
                </div>

                {/* Área de Mensajes (Scrollable) */}
                <div className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: '#fcf7ff' }}>
                  <div className="d-flex flex-column gap-3">
                    {messagesData.map((msg) => (
                      <div key={msg.id} className="card border shadow-none" style={{ borderRadius: '8px' }}>
                        <div className="card-body py-2 px-3">
                          <div className="mb-2">
                            <span className="fw-bold me-2">{msg.sender}</span>
                            <span className="text-secondary small">• {msg.date}</span>
                          </div>
                          <p className="mb-0 text-dark">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer (Input) */}
                <div className="p-4 mt-auto">
                  <div
                    className="w-100 p-3"
                    style={{
                      backgroundColor: '#e9daed', // Color lila grisáceo similar a la imagen
                      borderRadius: '8px',
                      color: '#6c757d',
                    }}
                  >
                    Escribe un mensaje...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
