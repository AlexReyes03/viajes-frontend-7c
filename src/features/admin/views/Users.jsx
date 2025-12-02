import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';
import DataTable from '../components/DataTable';
import { UserService } from '../../../api/user/user.service';

// Admin users management view
export default function Users() {
  const toast = useRef(null);
  // State for users and filters
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users on mount
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserService.getAllUsers();
      if (response && response.data) {
        // Transform data for UI compatibility
        const transformedUsers = response.data.map((user) => ({
          ...user,
          // Store original fields for editing
          originalName: user.name,
          // Create display fields for DataTable
          name: `${user.name} ${user.surname} ${user.lastname || ''}`.trim(),
          type: user.role ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1).toLowerCase() : 'Desconocido',
          status: user.status, // Pass boolean directly for StatusBadge to handle
        }));
        setUsers(transformedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    const lowerSearch = searchTerm.toLowerCase();
    return users.filter((user) => {
      return user.name.toLowerCase().includes(lowerSearch) || user.email.toLowerCase().includes(lowerSearch) || (user.username && user.username.toLowerCase().includes(lowerSearch)) || (user.type && user.type.toLowerCase().includes(lowerSearch));
    });
  }, [users, searchTerm]);

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle edit user
  const handleEdit = (user) => {
    // Map type/status back to editable values if needed
    setSelectedUser({
      ...user,
      name: user.originalName, // Use original first name
      type: user.role ? user.role.name.toUpperCase() : 'CLIENTE',
    });
    setShowEditDialog(true);
  };

  // Handle toggle user status
  const handleToggleStatus = async (user) => {
    try {
      const updatedUser = { ...user, status: !user.status };
      // Restore original name property for the backend object if it was overwritten
      updatedUser.name = user.originalName;

      await UserService.updateUser(updatedUser);
      toast.current?.show({ severity: 'success', summary: 'Éxito', detail: `Usuario ${updatedUser.status ? 'activado' : 'desactivado'} correctamente` });
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado' });
    }
  };

  // Handle save user changes
  const handleSaveUser = async () => {
    try {
      // Construct payload
      // We need to map the 'type' string back to a Role object
      let roleObj = selectedUser.role;
      if (selectedUser.type === 'ADMIN') roleObj = { id: 1, name: 'ADMIN' };
      else if (selectedUser.type === 'CLIENTE') roleObj = { id: 2, name: 'CLIENTE' };
      else if (selectedUser.type === 'CONDUCTOR') roleObj = { id: 3, name: 'CONDUCTOR' };

      const payload = {
        ...selectedUser,
        name: selectedUser.name, // This is the edited first name
        role: roleObj,
        // surname, lastname, email, etc are already in selectedUser
      };

      // Remove UI-only fields before sending if strict validation (optional, usually ignored by backend)
      delete payload.originalName;
      delete payload.statusStr;

      await UserService.updateUser(payload);

      toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente' });
      setShowEditDialog(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el usuario' });
    }
  };

  return (
    <div className="container py-3">
      <Toast ref={toast} />

      {/* Header & Search Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="card-body p-3">
              <div className="row align-items-center g-3">
                <div className="col-12 col-md-auto me-auto">
                  <h5 className="fw-bold mb-0">Lista de Usuarios</h5>
                </div>

                <div className="col-12 col-md-auto">
                  <div className="position-relative">
                    <Icon
                      path={mdiMagnify}
                      size={1}
                      className="position-absolute text-secondary"
                      style={{
                        top: '50%',
                        left: '12px',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                      }}
                    />
                    <InputText
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Buscar usuario..."
                      className="w-100"
                      style={{
                        borderRadius: '12px',
                        paddingLeft: '40px',
                        minWidth: '250px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users List Section */}
      <div className="mb-3">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
          </div>
        ) : (
          <DataTable data={filteredUsers} onEdit={handleEdit} onToggleStatus={handleToggleStatus} />
        )}
      </div>

      {/* Edit User Dialog - Responsive without scrollbar */}
      <Dialog
        header="Editar Usuario"
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        style={{ width: '95vw', maxWidth: '700px' }}
        breakpoints={{ '768px': '95vw' }}
        draggable={false}
        resizable={false}
        modal
        className="border-0 shadow"
        headerClassName="border-0 pb-0 fw-bold"
        contentClassName="pt-4"
        contentStyle={{ overflowY: 'auto', maxHeight: '70vh' }}
      >
        {selectedUser && (
          <div className="d-flex flex-column gap-3">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Nombre</label>
                <InputText id="editName" value={selectedUser.name} onChange={(e) => setSelectedUser((prev) => ({ ...prev, name: e.target.value }))} className="w-100" />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Apellido Paterno</label>
                <InputText id="editSurname" value={selectedUser.surname} onChange={(e) => setSelectedUser((prev) => ({ ...prev, surname: e.target.value }))} className="w-100" />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Apellido Materno</label>
                <InputText id="editLastname" value={selectedUser.lastname || ''} onChange={(e) => setSelectedUser((prev) => ({ ...prev, lastname: e.target.value }))} className="w-100" />
              </div>
              
              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Teléfono</label>
                <InputText id="editPhone" value={selectedUser.phoneNumber} onChange={(e) => setSelectedUser((prev) => ({ ...prev, phoneNumber: e.target.value }))} className="w-100" />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Correo</label>
                <InputText id="editEmail" value={selectedUser.email} onChange={(e) => setSelectedUser((prev) => ({ ...prev, email: e.target.value }))} className="w-100" />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Tipo</label>
                <Dropdown
                  value={selectedUser.type}
                  options={[
                    { label: 'Cliente', value: 'CLIENTE' },
                    { label: 'Conductor', value: 'CONDUCTOR' },
                    { label: 'Administrador', value: 'ADMIN' },
                  ]}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, type: e.value }))}
                  className="w-100"
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-secondary">Estado</label>
                <Dropdown
                  value={selectedUser.status}
                  options={[
                    { label: 'Activo', value: true },
                    { label: 'Inactivo', value: false },
                  ]}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, status: e.value }))}
                  className="w-100"
                />
              </div>
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
