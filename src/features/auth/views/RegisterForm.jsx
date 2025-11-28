import React from 'react';
import { Button } from 'primereact/button';
import PasswordInput from '../components/PasswordInput';

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
                  <input type="text" className="form-control" id="nombre" placeholder="Nombre" autoComplete="off" />
                  <label htmlFor="nombre">Nombre</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="text" className="form-control" id="apPaterno" placeholder="Apellido paterno" autoComplete="off" />
                  <label htmlFor="apPaterno">Apellido paterno</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="text" className="form-control" id="apMaterno" placeholder="Apellido materno" autoComplete="off" />
                  <label htmlFor="apMaterno">Apellido materno</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="tel" className="form-control" id="telefono" placeholder="Número telefónico" autoComplete="off" />
                  <label htmlFor="telefono">Número telefónico</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="text" className="form-control" id="usuario" placeholder="Usuario" autoComplete="off" />
                  <label htmlFor="usuario">Usuario</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input type="email" className="form-control" id="email" placeholder="Correo electrónico" autoComplete="off" />
                  <label htmlFor="email">Correo electrónico</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <PasswordInput id="pass" label="Contraseña" placeholder="Contraseña" />
              </div>

              <div className="col-12 col-md-6">
                <PasswordInput id="confirmPass" label="Confirmar contraseña" placeholder="Confirmar contraseña" />
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
