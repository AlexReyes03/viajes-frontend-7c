import React from 'react';
import { Button } from 'primereact/button';

export default function RegisterForm() {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="card border-0 shadow-lg">
          <div className="card-body p-4 p-lg-5">
            <h5 className="card-title fw-bold mb-4">Crea una cuenta</h5>

            <form className="row g-3">
              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="text" className="form-control" id="nombre" placeholder="Nombre" />
                  <label htmlFor="nombre">Nombre</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="text" className="form-control" id="apPaterno" placeholder="Apellido paterno" />
                  <label htmlFor="apPaterno">Apellido paterno</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="text" className="form-control" id="apMaterno" placeholder="Apellido materno" />
                  <label htmlFor="apMaterno">Apellido materno</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="tel" className="form-control" id="telefono" placeholder="Número telefónico" />
                  <label htmlFor="telefono">Número telefónico</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="text" className="form-control" id="usuario" placeholder="Usuario" />
                  <label htmlFor="usuario">Usuario</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="email" className="form-control" id="email" placeholder="Correo electrónico" />
                  <label htmlFor="email">Correo electrónico</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating position-relative">
                  <input type="password" className="form-control" id="pass" placeholder="Contraseña" />
                  <label htmlFor="pass">Contraseña</label>
                  <i className="bi bi-eye position-absolute top-50 end-0 translate-middle-y me-3 text-muted" style={{ cursor: 'pointer', zIndex: 5 }}></i>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating position-relative">
                  <input type="password" className="form-control" id="confirmPass" placeholder="Confirmar contraseña" />
                  <label htmlFor="confirmPass">Confirmar contraseña</label>
                  <i className="bi bi-eye position-absolute top-50 end-0 translate-middle-y me-3 text-muted" style={{ cursor: 'pointer', zIndex: 5 }}></i>
                </div>
              </div>

              <div className="col-12 mt-4 text-end">
                <Button label="Crear Cuenta" className="btn-lime px-5" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
