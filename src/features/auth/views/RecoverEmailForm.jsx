import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { requestOtp } from '../../../api/auth/auth.service';

export default function RecoverEmailForm() {
  const navigate = useNavigate();
  const toast = React.useRef(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await requestOtp(email);
      toast.current.show({ severity: 'success', summary: 'Código enviado', detail: 'Revisa tu correo electrónico.' });
      // Pass email to next step
      setTimeout(() => navigate('/recover-otp', { state: { email } }), 1000);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'No se pudo enviar el código.' });
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
              <div className="bg-white position-relative z-1 px-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', border: '3px solid var(--color-teal-tint-1)' }}></div>
              </div>
              <div className="bg-white position-relative z-1 px-2">
                <div className="rounded-circle" style={{ width: '24px', height: '24px', backgroundColor: '#dee2e6' }}></div>
              </div>
              <div className="bg-white position-relative z-1 px-2">
                <div className="rounded-circle" style={{ width: '24px', height: '24px', backgroundColor: '#dee2e6' }}></div>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-5 small fw-bold">
              <div className="text-start text-black" style={{ flex: 1 }}>Correo electrónico</div>
              <div className="text-center text-muted" style={{ flex: 1 }}>Código de seguridad</div>
              <div className="text-end text-muted" style={{ flex: 1 }}>Nueva contraseña</div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-4">
                <input 
                  type="email" 
                  className="form-control" 
                  id="emailRecover" 
                  placeholder="Correo electrónico" 
                  autoComplete="off" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="emailRecover">
                  <i className="bi bi-envelope me-2"></i>Correo electrónico
                </label>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-5">
                <Link to="/login">
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
