import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';

const NotFound = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3"> <span className="text-danger">Opps!</span> Página no encontrada.</p>
        <p className="lead">
          La página que buscas no existe.
        </p>
        <Button label="Volver al inicio" icon="pi pi-home" rounded className="p-button-primary" component={Link} to="/"/>
      </div>
    </div>
  );
};

export default NotFound;
