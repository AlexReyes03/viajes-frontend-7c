import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">403</h1>
        <p className="fs-3">
          {' '}
          <span className="text-danger">Opps!</span> Acceso denegado.
        </p>
        <p className="lead">No tienes permiso para ver esta página.</p>
        <Link to="/" className="btn btn-primary">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
