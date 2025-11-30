import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../../../contexts/AuthContext';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ username, password });
      // The redirection is handled by PublicRouter logic or we can force it here if needed, 
      // but usually better to let the AppRouter structure handle it or navigate here.
      // Since useAuth updates state, PublicRouter might auto-redirect if we are on a Public route.
      // However, explicit navigation is safer after successful action.
      navigate('/'); 
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Credenciales incorrectas' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center justify-content-lg-end">
      <Toast ref={toast} />
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card border-0 shadow-lg">
          <div className="card-body p-4 p-lg-5">
            <h5 className="card-title fw-bold mb-4">Accede a tu cuenta</h5>

            <form onSubmit={handleLogin}>
              <div className="form-floating mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  id="floatingUser" 
                  placeholder="Usuario" 
                  autoComplete="off" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="floatingUser">Usuario</label>
              </div>

              <PasswordInput 
                id="floatingPassword" 
                label="Contraseña" 
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="mt-2 text-end">
                <Link to="/recover" className="text-muted text-decoration-none small">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button label="Iniciar Sesión" className="w-100 mt-4 btn-lime" type="submit" loading={loading} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
