import React from 'react';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';

export default function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulación de inicio de sesión
    navigate('/p/home');
  };

  return (
    <div className="row justify-content-center justify-content-lg-end">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card border-0 shadow-lg">
          <div className="card-body p-4 p-lg-5">
            <h5 className="card-title fw-bold mb-4">Accede a tu cuenta</h5>

            <form onSubmit={handleLogin}>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingUser" placeholder="Usuario" autoComplete="off" />
                <label htmlFor="floatingUser">Usuario</label>
              </div>

              <PasswordInput id="floatingPassword" label="Contraseña" placeholder="Contraseña" />

              <div className="mt-2 text-end">
                <Link to="/recover" className="text-muted text-decoration-none small">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button label="Iniciar Sesión" className="w-100 mt-4 btn-lime" onClick={handleLogin} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
