import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import PasswordInput from '../components/PasswordInput';
import { resetPassword } from '../../../api/auth/auth.service';

export default function RecoverPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Get data from previous step
  const { email, code } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Información de sesión perdida. Reinicia el proceso.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden.' });
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada. Inicia sesión.' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'No se pudo actualizar la contraseña.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <Toast ref={toast} />
      <div className="col-12 col-md-10 col-lg-7">
        <div className="card border-0 shadow-lg">
          <div className="card-body p-4 p-lg-5">
            <h5 className="card-title fw-bold mb-4">Recupera tu cuenta</h5>

            {/* ... Progress Bar ... */}
            <div className="d-flex align-items-center justify-content-between mb-2 position-relative">
              <div className="position-absolute w-100" style={{ height: '2px', backgroundColor: '#e9ecef', zIndex: 0 }}></div>
              <div className="position-absolute w-100" style={{ height: '2px', backgroundColor: 'var(--color-teal-tint-1)', zIndex: 0, left: 0 }}></div>
              <div className="bg-white position-relative z-1 px-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', backgroundColor: 'var(--color-teal-tint-1)' }}></div>
              </div>
              <div className="bg-white position-relative z-1 px-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', backgroundColor: 'var(--color-teal-tint-1)' }}></div>
              </div>
              <div className="bg-white position-relative z-1 px-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', border: '3px solid var(--color-teal-tint-1)' }}></div>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-5 small fw-bold">
              <div className="text-start text-black" style={{ flex: 1 }}>Correo electrónico</div>
              <div className="text-center text-black" style={{ flex: 1 }}>Código de seguridad</div>
              <div className="text-end text-black" style={{ flex: 1 }}>Nueva contraseña</div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <PasswordInput
                  id="newPassword"
                  label={<span><i className="bi bi-lock me-2"></i>Nueva contraseña</span>}
                  className="w-100"
                  placeholder="Ingrese su contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <PasswordInput
                  id="confirmPassword"
                  label={<span><i className="bi bi-lock me-2"></i>Confirme su contraseña</span>}
                  className="w-100"
                  placeholder="Confirme su contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-3 mt-5">
                <Link to="/login">
                  <Button label="Cancelar" className="p-button-outlined fw-bold px-4" style={{ color: 'var(--color-teal-tint-1)', borderColor: 'var(--color-teal-tint-1)' }} />
                </Link>
                <Button label="Guardar" className="btn-lime px-4" type="submit" loading={loading} disabled={loading || !newPassword || !confirmPassword} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
