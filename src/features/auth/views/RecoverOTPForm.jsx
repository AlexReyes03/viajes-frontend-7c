import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputOtp } from 'primereact/inputotp';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { verifyOtp } from '../../../api/auth/auth.service';

export default function RecoverOTPForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = React.useRef(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get email passed from previous step
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) return;
    if (!email) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Falta el correo electrónico. Vuelve al paso anterior.' });
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email, code);
      toast.current.show({ severity: 'success', summary: 'Código verificado', detail: 'Puedes restablecer tu contraseña.' });
      // Pass email and code to next step (needed for reset)
      setTimeout(() => navigate('/recover-password', { state: { email, code } }), 1000);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Código inválido.' });
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
              <div className="position-absolute" style={{ height: '2px', width: '50%', backgroundColor: 'var(--color-teal-tint-1)', zIndex: 0, left: 0 }}></div>
              <div className="bg-white position-relative z-1 px-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', backgroundColor: 'var(--color-teal-tint-1)' }}></div>
              </div>
              <div className="bg-white position-relative z-1 px-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', border: '3px solid var(--color-teal-tint-1)' }}></div>
              </div>
              <div className="bg-white position-relative z-1 px-2">
                <div className="rounded-circle" style={{ width: '24px', height: '24px', backgroundColor: '#dee2e6' }}></div>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-5 small fw-bold">
              <div className="text-start text-black" style={{ flex: 1 }}>Correo electrónico</div>
              <div className="text-center text-black" style={{ flex: 1 }}>Código de seguridad</div>
              <div className="text-end text-muted" style={{ flex: 1 }}>Nueva contraseña</div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label mb-3 fw-semibold text-muted">
                  <i className="bi bi-lock me-2"></i>Código de seguridad
                </label>

                <div className="d-flex justify-content-center">
                  <InputOtp length={6} style={{ gap: '0.5rem' }} value={code} onChange={(e) => setCode(e.value)} />
                </div>
                <div className="text-center mt-2">
                   <small className="text-muted">Enviado a: {email}</small>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-5">
                <Link to="/recover">
                  <Button label="Volver" className="p-button-outlined fw-bold px-4" style={{ color: 'var(--color-teal-tint-1)', borderColor: 'var(--color-teal-tint-1)' }} />
                </Link>
                <Button label="Continuar" className="btn-lime px-4" type="submit" loading={loading} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
