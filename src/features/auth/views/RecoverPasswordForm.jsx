import React from 'react';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';

export default function RecoverPasswordForm() {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-7">
        <div className="card border-0 shadow-lg">
          <div className="card-body p-4 p-lg-5">
            <h5 className="card-title fw-bold mb-4">Recupera tu cuenta</h5>

            <div className="d-flex align-items-center justify-content-between mb-2 position-relative">
              <div className="position-absolute w-100" style={{ height: '2px', backgroundColor: 'var(--color-teal-tint-1)', zIndex: 0 }}></div>

              <div className="bg-white position-relative z-1 px-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', backgroundColor: 'var(--color-teal-tint-1)' }}></div>
              </div>

              <div className="bg-white position-relative z-1 px-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', backgroundColor: 'var(--color-teal-tint-1)' }}></div>
              </div>

              <div className="bg-white position-relative z-1 px-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center border border-3" style={{ width: '24px', height: '24px', borderColor: 'var(--color-teal-tint-1)' }}></div>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-5 small fw-bold">
              <span className="text-black">Correo electrónico</span>
              <span className="text-black">Código de seguridad</span>
              <span className="text-black">Nueva contraseña</span>
            </div>

            <form>
              <div className="mb-3">
                <PasswordInput id="newPassword" label="Nueva contraseña" className="w-100" placeholder="Ingrese su contraseña" />
              </div>

              <div className="mb-4">
                <PasswordInput id="confirmPassword" label="Confirme su contraseña" className="w-100" placeholder="Confirme su contraseña" />
              </div>

              <div className="d-flex justify-content-end gap-3 mt-5">
                <Link to="/login">
                  <Button label="Cancelar" className="p-button-outlined fw-bold px-4" style={{ color: 'var(--color-teal-tint-1)', borderColor: 'var(--color-teal-tint-1)' }} />
                </Link>
                <Link to="/login">
                  <Button label="Guardar" className="btn-lime px-4" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
