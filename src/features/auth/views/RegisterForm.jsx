import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { InputSwitch } from 'primereact/inputswitch';
import PasswordInput from '../components/PasswordInput';
import { register } from '../../../api/auth/auth.service';
import { Toast } from 'primereact/toast';

export default function RegisterForm() {
  const navigate = useNavigate();
  const toast = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apPaterno: '',
    apMaterno: '',
    telefono: '',
    usuario: '',
    email: '',
    pass: '',
    confirmPass: '',
    isDriver: false
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.pass !== formData.confirmPass) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.nombre,
        surname: formData.apPaterno,
        lastname: formData.apMaterno,
        username: formData.usuario,
        email: formData.email,
        phoneNumber: formData.telefono,
        password: formData.pass,
        isDriver: formData.isDriver
      };

      const response = await register(payload);
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: response.message || 'Cuenta creada correctamente' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Error al registrar' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <Toast ref={toast} />
      <div className="col-12 col-lg-8">
        <div className="card border-0 shadow-lg">
          <div className="card-body p-4 p-lg-5">
            <h5 className="card-title fw-bold mb-4">Crea una cuenta</h5>

            <form className="row g-3" onSubmit={handleSubmit}>
              {/* ... existing fields ... */}
              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="text" className="form-control" id="nombre" placeholder="Nombre" autoComplete="off" value={formData.nombre} onChange={handleChange} required />
                  <label htmlFor="nombre">Nombre</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="text" className="form-control" id="apPaterno" placeholder="Apellido paterno" autoComplete="off" value={formData.apPaterno} onChange={handleChange} required />
                  <label htmlFor="apPaterno">Apellido paterno</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="text" className="form-control" id="apMaterno" placeholder="Apellido materno" autoComplete="off" value={formData.apMaterno} onChange={handleChange} />
                  <label htmlFor="apMaterno">Apellido materno</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="tel" className="form-control" id="telefono" placeholder="Número telefónico" autoComplete="off" value={formData.telefono} onChange={handleChange} required pattern="[0-9]{10}" title="10 dígitos numéricos" />
                  <label htmlFor="telefono">Número telefónico</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="text" className="form-control" id="usuario" placeholder="Usuario" autoComplete="off" value={formData.usuario} onChange={handleChange} required />
                  <label htmlFor="usuario">Usuario</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="email" className="form-control" id="email" placeholder="Correo electrónico" autoComplete="off" value={formData.email} onChange={handleChange} required />
                  <label htmlFor="email">Correo electrónico</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <PasswordInput id="pass" label="Contraseña" placeholder="Contraseña" value={formData.pass} onChange={handleChange} />
              </div>

              <div className="col-12 col-md-6">
                <PasswordInput id="confirmPass" label="Confirmar contraseña" placeholder="Confirmar contraseña" value={formData.confirmPass} onChange={handleChange} />
              </div>

              <div className="col-12 d-flex align-items-center mt-3">
                <InputSwitch checked={formData.isDriver} onChange={(e) => setFormData(prev => ({ ...prev, isDriver: e.value }))} className="me-2" />
                <span className="text-muted fw-semibold">Quiero ser conductor</span>
              </div>

              <div className="col-12 mt-4 text-end">
                <Button label="Crear Cuenta" className="btn-lime px-5" type="submit" loading={loading} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
