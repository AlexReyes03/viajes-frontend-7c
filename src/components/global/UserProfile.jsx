import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import Icon from '@mdi/react';
import { mdiAccountEdit, mdiLockReset, mdiCog, mdiHistory, mdiLogout, mdiCheckDecagram, mdiCash, mdiBellOutline, mdiShieldAccountOutline } from '@mdi/js';
import PasswordInput from '../../features/auth/components/PasswordInput';
import { useAuth } from '../../contexts/AuthContext';

export default function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const currentRoot = location.pathname.startsWith('/d') ? '/d' : '/p';

  const InfoRow = ({ label, value, isLast = false }) => (
    <div className={`row py-2 ${!isLast ? '' : ''}`}>
      <div className="col-12 col-md-4">
        <span className="text-secondary fw-medium small">{label}</span>
      </div>
      <div className="col-12 col-md-8 text-md-end text-start">
        <span className="fw-semibold text-dark small">{value}</span>
      </div>
    </div>
  );

  const EditProfileModal = () => (
    <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-0 pb-0">
            <h4 className="modal-title fw-bold">Editar Perfil</h4>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body pt-4">
            <form>
              <h6 className="fw-bold mb-3 text-secondary">Información Personal</h6>
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="nombre" placeholder="Nombre" defaultValue={user?.name?.split(' ')[0] || ''} />
                    <label htmlFor="nombre">Nombre</label>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="apPaterno" placeholder="Apellido paterno" defaultValue={user?.paternalSurname || ''} />
                    <label htmlFor="apPaterno">Apellido paterno</label>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="apMaterno" placeholder="Apellido materno" defaultValue={user?.maternalSurname || ''} />
                    <label htmlFor="apMaterno">Apellido materno</label>
                  </div>
                </div>
              </div>

              <h6 className="fw-bold mb-3 text-secondary">Contacto</h6>
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <div className="form-floating">
                    <input type="email" className="form-control" id="email" placeholder="Correo electrónico" defaultValue={user?.email || ''} />
                    <label htmlFor="email">Correo electrónico</label>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-floating">
                    <input type="tel" className="form-control" id="telefono" placeholder="Número telefónico" defaultValue={user?.phone || ''} />
                    <label htmlFor="telefono">Número telefónico</label>
                  </div>
                </div>
              </div>

              <h6 className="fw-bold mb-3 text-secondary">Cuenta</h6>
              <div className="row g-3">
                <div className="col-12">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="usuario" placeholder="Usuario" defaultValue={user?.username || ''} />
                    <label htmlFor="usuario">Usuario</label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer border-0 pt-0 pb-4">
            <Button label="Cancelar" className="p-button-outlined fw-bold px-4" style={{ color: 'var(--color-cyan-tint-1)', borderColor: 'var(--color-cyan-tint-1)' }} data-bs-dismiss="modal" />
            <Button label="Guardar" className="btn-lime px-4" />
          </div>
        </div>
      </div>
    </div>
  );

  const ChangePasswordModal = () => {
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const isSaveDisabled = !currentPass || !newPass || !confirmPass;

    return (
      <div className="modal fade" id="changePasswordModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h4 className="modal-title fw-bold">Cambiar Contraseña</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body pt-4">
              <form className="d-flex flex-column gap-2">
                <PasswordInput id="currentPassword" label="Contraseña actual" placeholder="Contraseña actual" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} />
                <PasswordInput id="newPassword" label="Nueva contraseña" placeholder="Nueva contraseña" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                <PasswordInput id="confirmPassword" label="Confirmar contraseña" placeholder="Confirmar contraseña" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
              </form>
            </div>
            <div className="modal-footer border-0 pt-2 pb-4">
              <Button label="Cancelar" className="p-button-outlined fw-bold px-4" style={{ color: 'var(--color-cyan-tint-1)', borderColor: 'var(--color-cyan-tint-1)' }} data-bs-dismiss="modal" />
              <Button label="Guardar" className="btn-lime px-4" disabled={isSaveDisabled} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ConfigModal = () => (
    <div className="modal fade" id="configModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-0 pb-0">
            <h4 className="modal-title fw-bold">Configuración de la Cuenta</h4>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body pt-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center">
              <Icon path={mdiBellOutline} size={0.9} className="me-2" /> Preferencias de Notificaciones
            </h6>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-dark">Alertas de actividad</span>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" defaultChecked style={{ width: '3rem', height: '1.5rem' }} />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-dark">Recibir ofertas y promociones</span>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" style={{ width: '3rem', height: '1.5rem' }} />
              </div>
            </div>

            <h6 className="fw-bold mb-3 d-flex align-items-center mt-4">
              <Icon path={mdiShieldAccountOutline} size={0.9} className="me-2" /> Privacidad y Seguridad
            </h6>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-dark">Verificación en dos pasos</span>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" style={{ width: '3rem', height: '1.5rem' }} />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-dark">Mostrar foto de perfil</span>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" style={{ width: '3rem', height: '1.5rem' }} />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-dark">Mostrar mi número de teléfono</span>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" defaultChecked style={{ width: '3rem', height: '1.5rem' }} />
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 pt-2 pb-4">
            <Button label="Cancelar" className="p-button-outlined fw-bold px-4" style={{ color: 'var(--color-cyan-tint-1)', borderColor: 'var(--color-cyan-tint-1)' }} data-bs-dismiss="modal" />
            <Button label="Guardar" className="btn-lime px-4" />
          </div>
        </div>
      </div>
    </div>
  );

  const formatCreatedAt = (dateString) => {
    if (!dateString) return 'No disponible';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
        return dateString;
    }
  };

  return (
    <div className="w-100 container pb-3">
      <EditProfileModal />
      <ChangePasswordModal />
      <ConfigModal />

      <div className="row py-3 g-3">
        <div className="col-12 col-lg-4 col-xl-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-3 d-flex flex-column align-items-center text-center">
              <div className="mb-3 position-relative">
                <Avatar image={user.avatar} icon={!user.avatar ? 'pi pi-user' : null} shape="circle" className="bg-warning text-white" style={{ width: '150px', height: '150px', border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </div>

              <h5 className="fw-bold mb-1">{user?.name} {user?.paternalSurname}</h5>
              <span className="text-muted fs-5 mb-4">{user?.roles?.includes('ROLE_CONDUCTOR') ? 'Conductor' : 'Pasajero'}</span>

              <div className="w-100 d-flex flex-column gap-2">
                <Button
                  label="Editar Perfil"
                  icon={<Icon path={mdiAccountEdit} size={1} className="me-2" />}
                  className="w-100 text-start p-3 bg-light hoverable border-0"
                  text
                  style={{ color: 'var(--color-cyan-tint-1)' }}
                  data-bs-toggle="modal"
                  data-bs-target="#editProfileModal"
                />

                <Button
                  label="Cambiar Contraseña"
                  icon={<Icon path={mdiLockReset} size={1} className="me-2" />}
                  className="w-100 text-start p-3 bg-light hoverable border-0"
                  text
                  style={{ color: 'var(--color-cyan-tint-1)' }}
                  data-bs-toggle="modal"
                  data-bs-target="#changePasswordModal"
                />

                <Button label="Configuración" icon={<Icon path={mdiCog} size={1} className="me-2" />} className="w-100 text-start p-3 bg-light hoverable border-0" text style={{ color: 'var(--color-cyan-tint-1)' }} data-bs-toggle="modal" data-bs-target="#configModal" />

                <Button
                  label="Historial de Viajes"
                  icon={<Icon path={mdiHistory} size={1} className="me-2" />}
                  className="w-100 text-start p-3 bg-light hoverable border-0"
                  text
                  style={{ color: 'var(--color-cyan-tint-1)' }}
                  onClick={() => navigate(`${currentRoot}/trips`)}
                />

                <Button 
                  label="Cerrar Sesión" 
                  icon={<Icon path={mdiLogout} size={1} className="me-2" />} 
                  className="w-100 text-start p-3 mt-2 bg-light hoverable border-0" 
                  text 
                  style={{ color: '#BF3030' }} 
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8 col-xl-8">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-3">
              <h4 className="fw-bold mb-3">Información Personal</h4>
              <hr className="text-muted opacity-25 mb-3" />

              <div className="mb-3">
                <h6 className="fw-bold mb-3">Información Básica</h6>
                <div className="ps-2">
                  <InfoRow label="Nombre completo" value={`${user?.name || ''} ${user?.paternalSurname || ''} ${user?.maternalSurname || ''}`.trim() || 'No disponible'} />
                  <InfoRow
                    label="Email"
                    value={
                      <div className="d-flex align-items-center justify-content-md-end gap-2">
                        <span>{user?.email || 'No disponible'}</span>
                        <Icon path={mdiCheckDecagram} size={0.8} color="var(--color-lime-shade-2)" title="Verificado" />
                      </div>
                    }
                  />
                  <InfoRow label="Teléfono" value={user?.phone || 'No disponible'} />
                  <hr className="text-muted opacity-25 my-1" />
                </div>
              </div>

              <div className="mb-3">
                <h6 className="fw-bold mb-3">Seguridad</h6>
                <div className="ps-2">
                  <InfoRow label="Usuario" value={user?.username || 'No disponible'} />
                  <InfoRow label="Contraseña" value="*************" />
                  <hr className="text-muted opacity-25 my-1" />
                </div>
              </div>

              <div className="mb-3">
                <h6 className="fw-bold mb-3">Otros</h6>
                <div className="ps-2">
                  <InfoRow label="Fecha de alta" value={formatCreatedAt(user?.createdAt)} />
                  <InfoRow label="Estado" value={user?.status === true || user?.status === 'true' ? 'Activo' : 'Inactivo'} />
                  <hr className="text-muted opacity-25 my-1" />
                </div>
              </div>

              {/* ... Métodos de Pago section ... */}
              <div className="mb-0">
                <h6 className="fw-bold mb-3">Métodos de Pago</h6>
                <div className="ps-2">
                  <div className="row py-2">
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2">
                        <Icon path={mdiCash} size={1} />
                        <span className="fw-bold small">Efectivo</span>
                      </div>
                      <small className="text-muted d-block ms-4">Predeterminado</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
