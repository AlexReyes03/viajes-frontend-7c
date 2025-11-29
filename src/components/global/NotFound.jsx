import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import NotFoundImg from '../../assets/img/not-found.png';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <img src={NotFoundImg} alt="Error 404" className="img-fluid mb-4" style={{ maxWidth: '400px' }} />
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          {' '}
          <span className="text-danger">Opps!</span> Página no encontrada.
        </p>
        <p className="lead">La página que buscas no existe.</p>
        <Button label="Volver al inicio" icon="pi pi-home" rounded className="btn-lime" onClick={() => navigate('/')} />
      </div>
    </div>
  );
};

export default NotFound;
