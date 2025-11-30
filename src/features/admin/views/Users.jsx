import React, { useState, useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import FilterBar from '../components/FilterBar';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

// Mock data for users table - defined outside component to avoid recreating on each render
const MOCK_USERS = [
  { id: 1, name: 'Daniela Carrate', email: 'daniela@gmail.com', type: 'Conductor', status: 'Activo' },
  { id: 2, name: 'Isael Alejandro', email: 'isael@gmail.com', type: 'Cliente', status: 'Activo' },
  { id: 3, name: 'Jafet Bahena', email: 'jafet@gmail.com', type: 'Cliente', status: 'Activo' },
  { id: 4, name: 'Danna Sanchez', email: 'danna@gmail.com', type: 'Conductor', status: 'Activo' },
  { id: 5, name: 'Loreley Carrillo', email: 'loreley@gmail.com', type: 'Cliente', status: 'Activo' },
  { id: 6, name: 'José Arias', email: 'jose@gmail.com', type: 'Conductor', status: 'Activo' },
  { id: 7, name: 'Ángel Aguilar', email: 'angel@gmail.com', type: 'Cliente', status: 'Inactivo' },
];

// Admin users management view
export default function Users() {
  // State for filters
  const [filters, setFilters] = useState({
    userType: '',
    status: '',
    search: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter users based on current filters
  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      const matchesType = !filters.userType || user.type === filters.userType;
      const matchesStatus = !filters.status || user.status === filters.status;
      const matchesSearch = !filters.search || user.name.toLowerCase().includes(filters.search.toLowerCase()) || user.email.toLowerCase().includes(filters.search.toLowerCase());

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [filters]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  // Get paginated data
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage, pageSize]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle edit user
  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setShowEditDialog(true);
  };

  // Handle toggle user status
  const handleToggleStatus = (user) => {
    console.log('Toggle status for user:', user);
  };

  // Handle save user changes
  const handleSaveUser = () => {
    console.log('Saving user:', selectedUser);
    setShowEditDialog(false);
    setSelectedUser(null);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="container py-3">
      {/* Filters Section */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {/* Users List Section */}
      <div className="mb-3">
        <h5 className="fw-bold mb-3">Lista de Usuarios</h5>
        <DataTable data={paginatedUsers} onEdit={handleEdit} onToggleStatus={handleToggleStatus} />
      </div>

      {/* Pagination Section */}
      <div className="mt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} />
      </div>

      {/* Edit User Dialog - Responsive without scrollbar */}
      <Dialog
        header="Editar Usuario"
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        style={{ width: '95vw', maxWidth: '500px' }}
        breakpoints={{ '576px': '95vw' }}
        draggable={false}
        resizable={false}
        modal
        className="border-0 shadow"
        headerClassName="border-0 pb-0 fw-bold"
        contentClassName="pt-4 overflow-visible"
        contentStyle={{ overflow: 'visible' }}
      >
        {selectedUser && (
          <div className="d-flex flex-column gap-3">
            <div>
              <label className="form-label small fw-semibold text-secondary">Nombre</label>
              <InputText id="editName" value={selectedUser.name} onChange={(e) => setSelectedUser((prev) => ({ ...prev, name: e.target.value }))} className="w-100" />
            </div>

            <div>
              <label className="form-label small fw-semibold text-secondary">Correo</label>
              <InputText id="editEmail" value={selectedUser.email} onChange={(e) => setSelectedUser((prev) => ({ ...prev, email: e.target.value }))} className="w-100" />
            </div>

            <div>
              <label className="form-label small fw-semibold text-secondary">Tipo</label>
              <Dropdown
                value={selectedUser.type}
                options={[
                  { label: 'Cliente', value: 'Cliente' },
                  { label: 'Conductor', value: 'Conductor' },
                ]}
                onChange={(e) => setSelectedUser((prev) => ({ ...prev, type: e.value }))}
                className="w-100"
              />
            </div>

            <div>
              <label className="form-label small fw-semibold text-secondary">Estado</label>
              <Dropdown
                value={selectedUser.status}
                options={[
                  { label: 'Activo', value: 'Activo' },
                  { label: 'Inactivo', value: 'Inactivo' },
                ]}
                onChange={(e) => setSelectedUser((prev) => ({ ...prev, status: e.value }))}
                className="w-100"
              />
            </div>

            {/* Responsive footer buttons */}
            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 pt-3">
              <Button
                label="Cancelar"
                className="p-button-outlined fw-bold w-100 w-sm-auto order-2 order-sm-1"
                style={{
                  color: 'var(--color-secondary)',
                  borderColor: 'var(--color-secondary)',
                }}
                onClick={() => setShowEditDialog(false)}
              />
              <Button label="Guardar" className="btn-lime w-100 w-sm-auto order-1 order-sm-2" onClick={handleSaveUser} />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
