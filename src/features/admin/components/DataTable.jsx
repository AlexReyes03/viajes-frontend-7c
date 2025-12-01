import React from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Icon from '@mdi/react';
import { mdiPencilOutline, mdiSwapHorizontal } from '@mdi/js';
import StatusBadge from './StatusBadge';

// Data table component using PrimeReact
export default function DataTableComponent({ data, onEdit, onToggleStatus }) {
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="d-flex justify-content-center gap-2">
        <Button
          icon={<Icon path={mdiPencilOutline} size={0.9} />}
          className="p-button-outlined p-button-info"
          style={{
            width: '40px',
            height: '40px',
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
            width: '40px',
            height: '40px',
            borderColor: 'var(--color-red-tint-1)',
            color: 'var(--color-red-tint-1)',
          }}
          onClick={() => onToggleStatus(rowData)}
          tooltip="Cambiar estado"
          tooltipOptions={{ position: 'top' }}
        />
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
          <Column field="name" header="Nombre" sortable style={{ minWidth: '200px' }}></Column>
          <Column field="email" header="Correo" sortable style={{ minWidth: '200px' }}></Column>
          <Column field="type" header="Tipo" sortable style={{ minWidth: '150px', textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }}></Column>
          <Column field="status" header="Estado" sortable body={statusBodyTemplate} style={{ minWidth: '150px', textAlign: 'center' }}></Column>
          <Column header="Acciones" body={actionBodyTemplate} style={{ minWidth: '150px', textAlign: 'center' }}></Column>
        </DataTable>
      </div>
    </div>
  );
}
