import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import Icon from '@mdi/react';
import { mdiFileUpload, mdiFilePdfBox, mdiCloseCircle } from '@mdi/js';
import PasswordInput from '../components/PasswordInput';
import { register, completeDriverRegistration } from '../../../api/auth/auth.service';

export default function RegisterForm() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
    driverDocument: null, // File object
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileClick = () => {
    // If file exists, clear it
    if (formData.driverDocument) {
      setFormData((prev) => ({ ...prev, driverDocument: null }));
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      // Trigger file selection
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Solo se permiten archivos PDF' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'El archivo excede los 5MB' });
        return;
      }
      setFormData((prev) => ({ ...prev, driverDocument: file }));
    }
  };

  const validateStep1 = () => {
    if (!formData.nombre || !formData.apPaterno || !formData.telefono || !formData.usuario || !formData.email || !formData.pass || !formData.confirmPass) {
      toast.current.show({ severity: 'warn', summary: 'Campos requeridos', detail: 'Por favor completa todos los campos obligatorios marcados con *' });
      return false;
    }
    if (formData.pass !== formData.confirmPass) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden' });
      return false;
    }
    if (!/^\d{10}$/.test(formData.telefono)) {
      toast.current.show({ severity: 'warn', summary: 'Teléfono inválido', detail: 'El teléfono debe tener 10 dígitos' });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.licenseNumber || !formData.vehicleBrand || !formData.vehicleModel || !formData.vehicleYear || !formData.vehiclePlate || !formData.vehicleColor) {
      toast.current.show({ severity: 'warn', summary: 'Campos requeridos', detail: 'Por favor completa todos los datos del vehículo' });
      return false;
    }
    if (!formData.driverDocument) {
      toast.current.show({ severity: 'warn', summary: 'Documento requerido', detail: 'Debes subir la constancia de no antecedentes penales' });
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.isDriver && currentStep === 2) {
      if (!validateStep2()) return;
    } else {
      if (!validateStep1()) return;
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
        isDriver: formData.isDriver,
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
            active: true,
          };

          await completeDriverRegistration(response.userId, formData.licenseNumber, vehicleData, formData.driverDocument);

          toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Registro completado. Tu cuenta está pendiente de aprobación.' });
          setTimeout(() => navigate('/login'), 3000);
        } catch (driverError) {
          console.error(driverError);
          toast.current.show({ severity: 'warn', summary: 'Registro Parcial', detail: 'Usuario creado pero hubo un error guardando datos del conductor.' });
          setTimeout(() => navigate('/login'), 4000);
        }
      } else {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Cuenta creada correctamente' });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error(error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Error al registrar usuario' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <Toast ref={toast} />
      <div className="col-12 col-lg-8">
        <div className="card border-0 shadow-lg">
          <div className="card-body p-4 px-1 p-lg-5 px-lg-3">
            <h4 className="card-title fw-bold mb-4 text-center">Crea una cuenta</h4>

            {/* Scrollable Form Container */}
            <div style={{ overflowY: 'auto', maxHeight: '60vh', paddingRight: '5px', overflowX: 'hidden' }} className="custom-scrollbar mb-3">
              <form onSubmit={handleSubmit} className="row g-3 mx-0">
                {/* STEP 1: Basic Info */}
                {currentStep === 1 && (
                  <>
                    <div className="col-12 col-md-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} autoComplete="off" />
                        <label htmlFor="nombre" className="text-secondary">
                          Nombre <span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="apPaterno" placeholder="Apellido paterno" value={formData.apPaterno} onChange={handleChange} autoComplete="off" />
                        <label htmlFor="apPaterno" className="text-secondary">
                          Apellido paterno <span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="apMaterno" placeholder="Apellido materno" value={formData.apMaterno} onChange={handleChange} autoComplete="off" />
                        <label htmlFor="apMaterno" className="text-secondary">
                          Apellido materno
                        </label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="form-floating">
                        <input type="tel" className="form-control" id="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} maxLength={10} autoComplete="off" />
                        <label htmlFor="telefono" className="text-secondary">
                          Teléfono <span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="usuario" placeholder="Usuario" value={formData.usuario} onChange={handleChange} autoComplete="off" />
                        <label htmlFor="usuario" className="text-secondary">
                          Usuario <span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="form-floating">
                        <input type="email" className="form-control" id="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} autoComplete="off" />
                        <label htmlFor="email" className="text-secondary">
                          Correo electrónico <span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <PasswordInput
                        id="pass"
                        label={
                          <>
                            Contraseña <span className="text-danger">*</span>
                          </>
                        }
                        placeholder="Contraseña"
                        value={formData.pass}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <PasswordInput
                        id="confirmPass"
                        label={
                          <>
                            Confirmar contraseña <span className="text-danger">*</span>
                          </>
                        }
                        placeholder="Confirmar contraseña"
                        value={formData.confirmPass}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Password Mismatch Alert - Centered */}
                    {formData.pass && formData.confirmPass && formData.pass !== formData.confirmPass && (
                      <div className="col-12 text-center mt-2">
                        <small className="text-danger fw-bold px-3 py-1 rounded" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}>
                          <i className="pi pi-times-circle me-1"></i>Las contraseñas no coinciden
                        </small>
                      </div>
                    )}
                  </>
                )}

                {/* STEP 2: Driver Info */}
                {currentStep === 2 && (
                  <>
                    <div className="col-12">
                      <h6 className="fw-bold text-secondary mb-3 border-bottom pb-2">Información de Conductor</h6>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="licenseNumber" placeholder="Licencia" value={formData.licenseNumber} onChange={handleChange} autoComplete="off" />
                        <label htmlFor="licenseNumber" className="text-secondary">
                          No. Licencia <span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>

                    {/* Moved Document Input Here - Stacks on mobile, side-by-side on md+ */}
                    <div className="col-12 col-md-6">
                      <input type="file" ref={fileInputRef} accept="application/pdf" style={{ display: 'none' }} onChange={handleFileChange} />

                      <div
                        className={`d-flex align-items-center justify-content-center p-2 border rounded cursor-pointer h-100 ${formData.driverDocument ? 'bg-light border-success' : 'bg-white'}`}
                        onClick={handleFileClick}
                        style={{ cursor: 'pointer', borderStyle: 'dashed !important', minHeight: '58px' }}
                        title="Subir documento"
                      >
                        <div className="d-flex align-items-center gap-2 text-center w-100 justify-content-center">
                          <Icon path={formData.driverDocument ? mdiFilePdfBox : mdiFileUpload} size={1.2} color={formData.driverDocument ? 'var(--color-red-tint-1)' : 'gray'} className="flex-shrink-0" />
                          <div className="d-flex flex-column overflow-hidden">
                            <span className="fw-semibold text-dark small text-truncate" style={{ maxWidth: '100%' }}>
                              {formData.driverDocument ? formData.driverDocument.name : 'Sube tu constancia de No Antecedentes penales en PDF, 5MB Max'}
                            </span>
                            {formData.driverDocument && <small className="text-success x-small">Archivo cargado</small>}
                          </div>
                          {formData.driverDocument && <Icon path={mdiCloseCircle} size={0.8} color="gray" className="ms-1 flex-shrink-0" />}
                        </div>
                      </div>
                      {!formData.driverDocument && (
                        <small className="text-muted x-small ms-1">
                          Formato PDF, Máx 5MB <span className="text-danger">*</span>
                        </small>
                      )}
                    </div>

                    <div className="col-12 mt-4">
                      <h6 className="fw-bold text-secondary mb-3 border-bottom pb-2">Datos del Vehículo</h6>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="vehicleBrand" placeholder="Marca" value={formData.vehicleBrand} onChange={handleChange} autoComplete="off" />
                        <label htmlFor="vehicleBrand" className="text-secondary">
                          Marca <span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="vehicleModel" placeholder="Modelo" value={formData.vehicleModel} onChange={handleChange} autoComplete="off" />
                        <label htmlFor="vehicleModel" className="text-secondary">
                          Modelo <span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-12 col-md-4">
                      <div className="form-floating">
                        <input type="number" className="form-control" id="vehicleYear" placeholder="Año" value={formData.vehicleYear} onChange={handleChange} min="1900" max="2030" autoComplete="off" />
                        <label htmlFor="vehicleYear" className="text-secondary">
                          Año <span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-12 col-md-4">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="vehiclePlate" placeholder="Placa" value={formData.vehiclePlate} onChange={handleChange} style={{ textTransform: 'uppercase' }} autoComplete="off" />
                        <label htmlFor="vehiclePlate" className="text-secondary">
                          Placa <span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-12 col-md-4">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="vehicleColor" placeholder="Color" value={formData.vehicleColor} onChange={handleChange} autoComplete="off" />
                        <label htmlFor="vehicleColor" className="text-secondary">
                          Color <span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </form>
            </div>

            {/* Footer Actions - Responsive Stacking */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 pt-2 border-top gap-3">
              {/* Left Side: Switch (only on Step 1) OR Back Button (Step 2) */}
              <div className="w-100 w-md-auto order-2 order-md-1 text-center text-md-start">
                {currentStep === 1 ? (
                  <div className="d-flex align-items-center justify-content-center justify-content-md-start p-2 rounded bg-light-subtle">
                    <InputSwitch checked={formData.isDriver} onChange={(e) => setFormData((prev) => ({ ...prev, isDriver: e.value }))} className="me-2" />
                    <span className={`fw-semibold ${formData.isDriver ? 'text-primary' : 'text-secondary'}`}>Quiero ser conductor</span>
                  </div>
                ) : (
                  <Button className="p-button-rounded p-button-outlined p-button-secondary" label="Atrás" tooltip="Atrás" tooltipOptions={{ position: 'top' }} onClick={handleBack} />
                )}
              </div>

              {/* Right Side: Main Action Button */}
              <div className="w-100 w-md-auto order-1 order-md-2">
                {formData.isDriver && currentStep === 1 ? (
                  <Button label="Continuar" className="btn-lime px-5 rounded-pill w-100 w-md-auto" onClick={handleContinue} />
                ) : (
                  <Button label="Crear Cuenta" className="btn-lime px-5 rounded-pill w-100 w-md-auto" onClick={handleSubmit} loading={loading} disabled={loading} />
                )}
              </div>
            </div>

            {/* Step Indicators (Carousel style) - Only if isDriver is true */}
            {formData.isDriver && (
              <div className="d-flex justify-content-center gap-2 mt-3">
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: currentStep === 1 ? 'var(--color-lime-shade-2)' : '#dee2e6',
                    transition: 'background-color 0.3s',
                  }}
                />
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: currentStep === 2 ? 'var(--color-lime-shade-2)' : '#dee2e6',
                    transition: 'background-color 0.3s',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
