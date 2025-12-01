import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { InputSwitch } from 'primereact/inputswitch';
import { FileUpload } from 'primereact/fileupload';
import PasswordInput from '../components/PasswordInput';
import { register, completeDriverRegistration } from '../../../api/auth/auth.service';
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
    isDriver: false,
    // Driver-specific fields
    licenseNumber: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    vehicleColor: '',
    driverDocument: null // File object
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.pass !== formData.confirmPass) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden' });
      return;
    }

    // Validate driver-specific fields
    if (formData.isDriver) {
      if (!formData.licenseNumber || !formData.vehicleBrand || !formData.vehicleModel ||
          !formData.vehicleYear || !formData.vehiclePlate || !formData.vehicleColor) {
        toast.current.show({ severity: 'error', summary: 'Error',
          detail: 'Todos los campos de conductor son obligatorios' });
        return;
      }

      if (!formData.driverDocument) {
        toast.current.show({ severity: 'error', summary: 'Error',
          detail: 'Debes cargar la constancia de no antecedentes penales (PDF)' });
        return;
      }

      if (formData.driverDocument.type !== 'application/pdf') {
        toast.current.show({ severity: 'error', summary: 'Error',
          detail: 'El documento debe ser un archivo PDF' });
        return;
      }

      if (formData.driverDocument.size > 5 * 1024 * 1024) {
        toast.current.show({ severity: 'error', summary: 'Error',
          detail: 'El archivo no debe superar los 5MB' });
        return;
      }
    }

    setLoading(true);
    try {
      // Step 1: Register basic user
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

      // If driver registration, complete additional steps
      if (formData.isDriver && response.userId) {
        try {
          const vehicleData = {
            brand: formData.vehicleBrand,
            model: formData.vehicleModel,
            year: parseInt(formData.vehicleYear, 10),
            plate: formData.vehiclePlate.toUpperCase(),
            color: formData.vehicleColor,
            active: true
          };

          await completeDriverRegistration(
            response.userId,
            formData.licenseNumber,
            vehicleData,
            formData.driverDocument
          );

          toast.current.show({ severity: 'success', summary: 'Éxito',
            detail: 'Registro de conductor completado. Tu cuenta está pendiente de aprobación.' });
          setTimeout(() => navigate('/login'), 3000);
        } catch (driverError) {
          toast.current.show({ severity: 'warn', summary: 'Registro Parcial',
            detail: `Usuario creado pero falló el registro de conductor: ${driverError.message}. Contacta al administrador.` });
          setTimeout(() => navigate('/login'), 4000);
        }
      } else {
        toast.current.show({ severity: 'success', summary: 'Éxito',
          detail: response.message || 'Cuenta creada correctamente' });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error',
        detail: error.message || 'Error al registrar' });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const basicFields = formData.nombre && formData.apPaterno && formData.telefono && formData.usuario && formData.email && formData.pass && formData.confirmPass;
    
    if (!basicFields) return false;
    
    if (formData.isDriver) {
      const driverFields = formData.licenseNumber && formData.vehicleBrand && formData.vehicleModel && formData.vehicleYear && formData.vehiclePlate && formData.vehicleColor && formData.driverDocument;
      return driverFields;
    }
    
    return true;
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

              {/* Driver-specific fields - shown only when isDriver is true */}
              {formData.isDriver && (
                <>
                  <div className="col-12 mt-4">
                    <h6 className="text-muted fw-bold mb-3">Información del Conductor</h6>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="form-floating">
                      <input type="text" className="form-control" id="licenseNumber" placeholder="Número de licencia" autoComplete="off" value={formData.licenseNumber} onChange={handleChange} required={formData.isDriver} />
                      <label htmlFor="licenseNumber">Número de licencia</label>
                    </div>
                  </div>

                  <div className="col-12 mt-3">
                    <h6 className="text-muted fw-bold mb-3">Datos del Vehículo</h6>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="form-floating">
                      <input type="text" className="form-control" id="vehicleBrand" placeholder="Marca" autoComplete="off" value={formData.vehicleBrand} onChange={handleChange} required={formData.isDriver} />
                      <label htmlFor="vehicleBrand">Marca</label>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="form-floating">
                      <input type="text" className="form-control" id="vehicleModel" placeholder="Modelo" autoComplete="off" value={formData.vehicleModel} onChange={handleChange} required={formData.isDriver} />
                      <label htmlFor="vehicleModel">Modelo</label>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="form-floating">
                      <input type="number" className="form-control" id="vehicleYear" placeholder="Año" autoComplete="off" value={formData.vehicleYear} onChange={handleChange} required={formData.isDriver} min="1900" max="2030" />
                      <label htmlFor="vehicleYear">Año</label>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="form-floating">
                      <input type="text" className="form-control" id="vehiclePlate" placeholder="Placa" autoComplete="off" value={formData.vehiclePlate} onChange={handleChange} required={formData.isDriver} style={{ textTransform: 'uppercase' }} />
                      <label htmlFor="vehiclePlate">Placa</label>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="form-floating">
                      <input type="text" className="form-control" id="vehicleColor" placeholder="Color" autoComplete="off" value={formData.vehicleColor} onChange={handleChange} required={formData.isDriver} />
                      <label htmlFor="vehicleColor">Color</label>
                    </div>
                  </div>

                  <div className="col-12 mt-3">
                    <h6 className="text-muted fw-bold mb-3">Constancia de No Antecedentes Penales</h6>
                  </div>

                  <div className="col-12">
                    <FileUpload mode="basic" name="driverDocument" accept="application/pdf" maxFileSize={5000000} chooseLabel="Seleccionar PDF" onSelect={(e) => setFormData(prev => ({ ...prev, driverDocument: e.files[0] }))} onClear={() => setFormData(prev => ({ ...prev, driverDocument: null }))} auto={false} customUpload />
                    <small className="text-muted">Máximo 5MB, solo formato PDF</small>
                  </div>
                </>
              )}

              <div className="col-12 mt-4 text-end">
                <Button label="Crear Cuenta" className="btn-lime px-5" type="submit" loading={loading} disabled={loading || !isFormValid()} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
