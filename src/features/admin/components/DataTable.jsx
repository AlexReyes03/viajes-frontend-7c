import React from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Icon from '@mdi/react';
import { mdiPencilOutline, mdiSwapHorizontal, mdiFileDocumentOutline, mdiFilePdfBox, mdiCar } from '@mdi/js';
import StatusBadge from './StatusBadge';

// Data table component using PrimeReact with responsive actions
export default function DataTableComponent({ data, onEdit, onToggleStatus, onViewDocuments, onViewPdf, onViewVehicle }) {
  // Check if user is a driver based on role
  const isDriver = (rowData) => {
    const roleName = rowData.role?.name?.toUpperCase() || rowData.type?.toUpperCase() || '';
    return roleName === 'CONDUCTOR' || rowData.type === 'Conductor';
  };

  const actionBodyTemplate = (rowData) => {
    const showDriverButtons = isDriver(rowData);

    return (
      <div className="d-flex justify-content-center align-items-center gap-2" style={{ minWidth: '130px' }}>
        <Button
          icon={<Icon path={mdiPencilOutline} size={0.9} />}
          className="p-button-outlined p-button-info"
          style={{
            width: '36px',
            height: '36px',
            borderColor: 'var(--color-cyan-tint-1)',
            color: 'var(--color-cyan-tint-1)',
          }}
          onClick={() => onEdit(rowData)}
          tooltip="Editar"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon={<Icon path={mdiSwapHorizontal} size={0.9} />}
          className="p-button-outlined p-button-danger"
          style={{
            width: '36px',
            height: '36px',
            borderColor: 'var(--color-red-tint-1)',
            color: 'var(--color-red-tint-1)',
          }}
          onClick={() => onToggleStatus(rowData)}
          tooltip="Cambiar estado"
          tooltipOptions={{ position: 'top' }}
        />
        {/* Driver-specific buttons */}
        {showDriverButtons && (
          <>
            {/* Documents button - from HEAD branch */}
            {onViewDocuments && (
              <Button
                icon={<Icon path={mdiFileDocumentOutline} size={0.9} />}
                className="p-button-outlined"
                style={{
                  width: '36px',
                  height: '36px',
                  borderColor: 'var(--color-lime-shade-1)',
                  color: 'var(--color-lime-shade-1)',
                }}
                onClick={() => onViewDocuments(rowData)}
                tooltip="Ver documentos"
                tooltipOptions={{ position: 'top' }}
              />
            )}
            {/* PDF button - from main branch */}
            {onViewPdf && (
              <Button
                icon={<Icon path={mdiFilePdfBox} size={0.9} />}
                className="p-button-outlined p-button-secondary"
                style={{
                  width: '36px',
                  height: '36px',
                }}
                onClick={() => onViewPdf(rowData)}
                tooltip="Ver PDF"
                tooltipOptions={{ position: 'top' }}
              />
            )}
            {/* Vehicle button - from main branch */}
            {onViewVehicle && (
              <Button
                icon={<Icon path={mdiCar} size={0.9} />}
                className="p-button-outlined p-button-help"
                style={{
                  width: '36px',
                  height: '36px',
                }}
                onClick={() => onViewVehicle(rowData)}
                tooltip="Datos del vehículo"
                tooltipOptions={{ position: 'top' }}
              />
            )}
          </>
        )}
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return <StatusBadge status={rowData.status} />;
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-0">
        <DataTable
          value={data}
          responsiveLayout="scroll"
          className="p-datatable-striped"
          emptyMessage="No se encontraron usuarios."
          paginator
          rows={15}
          rowsPerPageOptions={[5, 10, 15, 20]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} a {last} de {totalRecords}"
        >
          <Column field="name" header="Nombre" sortable style={{ minWidth: '180px' }} />
          <Column field="email" header="Correo" sortable style={{ minWidth: '180px' }} />
          <Column 
            field="type" 
            header="Tipo" 
            sortable 
            style={{ minWidth: '120px', textAlign: 'center' }} 
            bodyStyle={{ textAlign: 'center' }} 
          />
          <Column 
            field="status" 
            header="Estado" 
            sortable 
            body={statusBodyTemplate} 
            style={{ minWidth: '100px', textAlign: 'center' }} 
          />
          <Column 
            header="Acciones" 
            body={actionBodyTemplate} 
            style={{ minWidth: '220px', textAlign: 'center' }} 
          />
        </DataTable>
      </div>
    </div>
  );
}
