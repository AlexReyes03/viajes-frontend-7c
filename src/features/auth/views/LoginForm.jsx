import React from 'react';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

export default function LoginForm() {
  return (
    <div className="row justify-content-center justify-content-lg-end px-md-5">
      <div className="col-12 col-md-8 col-lg-4">
        <div className="card border-0 shadow-lg">
          <div className="card-body p-4 p-lg-5">
            <h5 className="card-title fw-bold mb-4">Accede a tu cuenta</h5>

            <form>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingUser" placeholder="Usuario" />
                <label htmlFor="floatingUser">Usuario</label>
              </div>

              <div className="form-floating position-relative">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Contraseña" />
                <label htmlFor="floatingPassword">Contraseña</label>
                <i className="bi bi-eye position-absolute top-50 end-0 translate-middle-y me-3 text-muted" style={{ cursor: 'pointer', zIndex: 5 }}></i>
              </div>

              <div className="mt-2 text-end">
                <Link to="/recover" className="text-muted text-decoration-none small">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button label="Iniciar Sesión" className="w-100 mt-4 btn-lime" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
