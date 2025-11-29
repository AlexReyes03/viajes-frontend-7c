import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import Icon from '@mdi/react';
import { mdiRefresh, mdiDotsHorizontal, mdiAccountOutline, mdiCrosshairsGps, mdiCash } from '@mdi/js';
import { Avatar } from 'primereact/avatar';

export default function TripHistory() {
  const navigate = useNavigate();

  // --- MODAL DETALLES ---
  const TripDetailsModal = () => (
    <div className="modal fade" id="tripDetailsModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow">
          {/* Header */}
          <div className="modal-header border-0 pb-0">
            <h4 className="modal-title fw-bold">Detalles del Viaje</h4>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          {/* Body */}
          <div className="modal-body pt-4">
            {/* Sección: Conductor */}
            <h6 className="fw-bold mb-3 d-flex align-items-center text-secondary">
              <Icon path={mdiAccountOutline} size={0.9} className="me-2" /> Conductor
            </h6>
            <div className="d-flex align-items-center gap-3 mb-4 ps-1">
              <Avatar icon="pi pi-user" size="large" shape="circle" className="bg-secondary bg-opacity-25 text-secondary" />
              <div>
                <h6 className="fw-normal mb-0 fs-5">Ignacio Sánchez Ramírez</h6>
                <div className="small text-muted">
                  <i className="pi pi-star-fill me-1 text-dark" style={{ fontSize: '0.8rem' }}></i>
                  <span className="text-dark fw-bold me-2">4.9</span>• 512 viajes completados
                </div>
              </div>
            </div>

            {/* Sección: Recorrido */}
            <h6 className="fw-bold mb-3 d-flex align-items-center text-secondary">
              <Icon path={mdiCrosshairsGps} size={0.9} className="me-2" /> Recorrido
            </h6>

            {/* Card Origen */}
            <div className="card border mb-3 shadow-none bg-light" style={{ borderRadius: '8px' }}>
              <div className="card-body py-2 px-3">
                <div className="text-dark small mb-0">
                  <span className="text-secondary me-2 fw-bold">Origen • 24 de Octubre 2025 - 1:06 PM</span>
                  <div className="text-dark mt-1">Docencia 2 UTEZ Emiliano Zapata...</div>
                </div>
              </div>
            </div>

            {/* Card Destino */}
            <div className="card border mb-4 shadow-none bg-light" style={{ borderRadius: '8px' }}>
              <div className="card-body py-2 px-3">
                <div className="text-dark small mb-0">
                  <span className="text-secondary me-2 fw-bold">Destino • 24 de Octubre 2025 - 1:35 PM</span>
                  <div className="text-dark mt-1">Casa en Privada Valle de San Luis...</div>
                </div>
              </div>
            </div>

            {/* Sección: Detalles del pago */}
            <h6 className="fw-bold mb-3 d-flex align-items-center text-secondary">
              <Icon path={mdiCash} size={0.9} className="me-2" /> Detalles del pago
            </h6>
            <div className="card border shadow-none bg-light" style={{ borderRadius: '8px' }}>
              <div className="card-body py-3 px-3">
                <div className="d-flex flex-column gap-1 small">
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold text-secondary">Método de Pago:</span>
                    <span className="fw-bold text-dark">Efectivo</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold text-secondary">Cantidad pagada:</span>
                    <span className="fw-bold text-success">$219.41 MXN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 pt-2 pb-4">
            <Button label="Cerrar" className="p-button-outlined fw-bold px-4" style={{ color: 'var(--color-teal-tint-1)', borderColor: 'var(--color-teal-tint-1)' }} data-bs-dismiss="modal" />
          </div>
        </div>
      </div>
    </div>
  );

  const TripCard = ({ address, date, price, mapImage }) => (
    <div className="card border shadow-sm mb-3" style={{ borderRadius: '12px' }}>
      <div className="card-body p-3">
        <div className="row align-items-center">
          {/* Imagen del Mapa */}
          <div className="col-auto">
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '8px',
                backgroundImage: `url(${mapImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#e9ecef',
              }}
            />
          </div>

          {/* Información del Viaje */}
          <div className="col">
            <h6 className="fw-bold mb-1 text-dark">{address}</h6>
            <p className="text-muted small mb-1">{date}</p>
            <p className="fw-bold text-dark mb-0">{price}</p>
          </div>

          {/* Botones de Acción */}
          <div className="col-12 col-md-auto mt-3 mt-md-0 d-flex gap-2 justify-content-end">
            <Button
              label="Reagendar"
              icon={<Icon path={mdiRefresh} size={0.8} className="me-2" />}
              className="p-button-outlined fw-bold px-3 py-2"
              onClick={() =>
                navigate('/p/home', {
                  state: {
                    action: 'reschedule',
                    origin: 'Docencia 2 UTEZ Emiliano Zapata',
                    destination: 'Casa en Privada Valle de San Luis',
                  },
                })
              }
              style={{
                color: 'var(--color-cyan-tint-1)',
                borderColor: 'var(--color-cyan-tint-1)',
                borderRadius: '8px',
                fontSize: '0.9rem',
              }}
            />
            <Button
              label="Ver detalles"
              icon={<Icon path={mdiDotsHorizontal} size={1} className="me-2" />}
              className="p-button-outlined fw-bold px-3 py-2"
              data-bs-toggle="modal"
              data-bs-target="#tripDetailsModal"
              style={{
                color: 'var(--color-teal-tint-1)',
                borderColor: 'var(--color-teal-tint-1)',
                borderRadius: '8px',
                fontSize: '0.9rem',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const mapPlaceholder = 'https://mt1.google.com/vt/lyrs=m&x=1325&y=3143&z=13';

  return (
    <div className="w-100 container pb-3">
      {/* INSERCIÓN DEL MODAL */}
      <TripDetailsModal />

      <div className="row justify-content-center py-3">
        <div className="col-12 col-lg-10">
          {/* SECCIÓN: Última actividad */}
          <h5 className="fw-bold mb-3 text-dark">Última actividad</h5>
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div className="card-body p-3">
              <TripCard address="Casa en Privada Valle de San Luis..." date="24 oct - 1:06 pm" price="$219.41 MXN" mapImage={mapPlaceholder} />
            </div>
          </div>

          {/* SECCIÓN: Anteriores */}
          <h5 className="fw-bold mb-3 text-dark">Anteriores</h5>
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body p-3">
              <TripCard address="Casa en Privada Valle de San Luis..." date="22 oct - 2:22 pm" price="$219.41 MXN" mapImage={mapPlaceholder} />

              <TripCard address="Casa en Privada Valle de San Luis..." date="18 oct - 6:33 pm" price="$219.41 MXN" mapImage={mapPlaceholder} />

              <TripCard address="Casa en Privada Valle de San Luis..." date="15 oct - 12:44 pm" price="$219.41 MXN" mapImage={mapPlaceholder} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
