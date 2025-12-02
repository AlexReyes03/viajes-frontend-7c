import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
import Icon from '@mdi/react';
import { mdiMagnify, mdiFileDocumentOutline, mdiOpenInNew, mdiAlertCircleOutline } from '@mdi/js';
import DataTable from '../components/DataTable';
import { UserService } from '../../../api/user/user.service';
import { getDriverFullInfo, openDocumentInNewTab, getDocumentTypeLabel } from '../../../api/driver/driver.service';

// Admin users management view
export default function Users() {
  const toast = useRef(null);
  
  // State for users and filters
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Documents dialog state
  const [showDocsDialog, setShowDocsDialog] = useState(false);
  const [selectedDriverInfo, setSelectedDriverInfo] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [docsError, setDocsError] = useState(null);

  // Fetch users on mount
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserService.getAllUsers();
      if (response && response.data) {
        const transformedUsers = response.data.map((user) => ({
          ...user,
          originalName: user.name,
          name: `${user.name} ${user.surname} ${user.lastname || ''}`.trim(),
          type: user.role ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1).toLowerCase() : 'Desconocido',
          status: user.status,
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
      return user.name.toLowerCase().includes(lowerSearch) || 
             user.email.toLowerCase().includes(lowerSearch) || 
             (user.username && user.username.toLowerCase().includes(lowerSearch)) || 
             (user.type && user.type.toLowerCase().includes(lowerSearch));
    });
  }, [users, searchTerm]);

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle edit user
  const handleEdit = (user) => {
    setSelectedUser({
      ...user,
      name: user.originalName,
      type: user.role ? user.role.name.toUpperCase() : 'CLIENTE',
    });
    setShowEditDialog(true);
  };

  // Handle toggle user status
  const handleToggleStatus = async (user) => {
    try {
      const updatedUser = { ...user, status: !user.status };
      updatedUser.name = user.originalName;

      await UserService.updateUser(updatedUser);
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: `Usuario ${updatedUser.status ? 'activado' : 'desactivado'} correctamente` 
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado' });
    }
  };

  // Handle view driver documents
  const handleViewDocuments = async (user) => {
    setShowDocsDialog(true);
    setLoadingDocs(true);
    setDocsError(null);
    setSelectedDriverInfo(null);

    try {
      const data = await getDriverFullInfo(user.id);
      setSelectedDriverInfo({
        user: data.user,
        driverProfile: data.driverProfile,
        documents: data.documents || []
      });
    } catch (error) {
      console.error('Error fetching driver documents:', error);
      setDocsError('No se pudieron cargar los documentos del conductor');
    } finally {
      setLoadingDocs(false);
    }
  };

  // Handle open document in new tab
  const handleOpenDocument = async (docId) => {
    try {
      await openDocumentInNewTab(docId);
    } catch {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se pudo abrir el documento' 
      });
    }
  };

  // Handle save user changes
  const handleSaveUser = async () => {
    try {
      let roleObj = selectedUser.role;
      if (selectedUser.type === 'ADMIN') roleObj = { id: 1, name: 'ADMIN' };
      else if (selectedUser.type === 'CLIENTE') roleObj = { id: 2, name: 'CLIENTE' };
      else if (selectedUser.type === 'CONDUCTOR') roleObj = { id: 3, name: 'CONDUCTOR' };

      const payload = {
        ...selectedUser,
        name: selectedUser.name,
        role: roleObj,
      };

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

  // Close documents dialog
  const handleCloseDocsDialog = () => {
    setShowDocsDialog(false);
    setSelectedDriverInfo(null);
    setDocsError(null);
  };

  // Render document card
  const renderDocumentCard = (doc) => (
    <div 
      key={doc.id} 
      className="d-flex align-items-center justify-content-between p-3 mb-2 rounded-3"
      style={{ backgroundColor: 'var(--surface-ground)', border: '1px solid var(--surface-border)' }}
    >
      <div className="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
        <div 
          className="d-flex align-items-center justify-content-center rounded-2"
          style={{ 
            width: '44px', 
            height: '44px', 
            backgroundColor: 'var(--color-lime-tint-2)',
            flexShrink: 0
          }}
        >
          <Icon path={mdiFileDocumentOutline} size={1.1} color="var(--color-lime-shade-1)" />
        </div>
        <div className="min-w-0">
          <p className="mb-0 fw-semibold text-truncate" style={{ fontSize: '0.95rem' }}>
            {getDocumentTypeLabel(doc.type)}
          </p>
          <small className="text-muted text-truncate d-block">
            {doc.originalName || 'documento.pdf'}
          </small>
        </div>
      </div>
      <Button
        icon={<Icon path={mdiOpenInNew} size={0.85} />}
        label="Abrir"
        className="p-button-sm p-button-outlined flex-shrink-0 ms-2"
        style={{
          borderColor: 'var(--color-cyan-tint-1)',
          color: 'var(--color-cyan-tint-1)',
        }}
        onClick={() => handleOpenDocument(doc.id)}
        tooltip="Abrir en nueva pestaña"
        tooltipOptions={{ position: 'top' }}
      />
    </div>
  );

  // Render documents dialog content
  const renderDocsDialogContent = () => {
    if (loadingDocs) {
      return (
        <div className="py-4">
          <Skeleton width="100%" height="70px" className="mb-2" />
          <Skeleton width="100%" height="70px" className="mb-2" />
          <Skeleton width="80%" height="70px" />
        </div>
      );
    }

    if (docsError) {
      return (
        <div className="text-center py-5">
          <Icon path={mdiAlertCircleOutline} size={2.5} color="var(--color-red-tint-1)" />
          <p className="mt-3 mb-0 text-muted">{docsError}</p>
          <Button
            label="Reintentar"
            className="p-button-link mt-2"
            onClick={() => selectedDriverInfo?.user && handleViewDocuments(selectedDriverInfo.user)}
          />
        </div>
      );
    }

    if (!selectedDriverInfo) {
      return null;
    }

    const { user, documents } = selectedDriverInfo;

    return (
      <div>
        {/* Driver info header */}
        <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: 'var(--surface-100)' }}>
          <h6 className="mb-1 fw-bold">
            {user?.name} {user?.surname} {user?.lastname || ''}
          </h6>
          <small className="text-muted">{user?.email}</small>
        </div>

        {/* Documents list */}
        {documents.length > 0 ? (
          <div>
            <p className="text-muted small mb-3">
              {documents.length} documento{documents.length !== 1 ? 's' : ''} registrado{documents.length !== 1 ? 's' : ''}
            </p>
            {documents.map(renderDocumentCard)}
          </div>
        ) : (
          <div className="text-center py-5">
            <Icon path={mdiFileDocumentOutline} size={2.5} color="var(--text-color-secondary)" />
            <p className="mt-3 mb-0 text-muted">
              Este conductor no tiene documentos registrados
            </p>
          </div>
        )}
      </div>
    );
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
          <DataTable 
            data={filteredUsers} 
            onEdit={handleEdit} 
            onToggleStatus={handleToggleStatus}
            onViewDocuments={handleViewDocuments}
          />
        )}
      </div>

      {/* Edit User Dialog */}
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
                <InputText 
                  id="editName" 
                  value={selectedUser.name} 
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, name: e.target.value }))} 
                  className="w-100" 
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Apellido Paterno</label>
                <InputText 
                  id="editSurname" 
                  value={selectedUser.surname} 
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, surname: e.target.value }))} 
                  className="w-100" 
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Apellido Materno</label>
                <InputText 
                  id="editLastname" 
                  value={selectedUser.lastname || ''} 
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, lastname: e.target.value }))} 
                  className="w-100" 
                />
              </div>
              
              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Teléfono</label>
                <InputText 
                  id="editPhone" 
                  value={selectedUser.phoneNumber} 
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, phoneNumber: e.target.value }))} 
                  className="w-100" 
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Correo</label>
                <InputText 
                  id="editEmail" 
                  value={selectedUser.email} 
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, email: e.target.value }))} 
                  className="w-100" 
                />
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
              <Button 
                label="Guardar" 
                className="btn-lime w-100 w-sm-auto order-1 order-sm-2" 
                onClick={handleSaveUser} 
              />
            </div>
          </div>
        )}
      </Dialog>

      {/* Documents Dialog */}
      <Dialog
        header="Documentos del Conductor"
        visible={showDocsDialog}
        onHide={handleCloseDocsDialog}
        style={{ width: '95vw', maxWidth: '550px' }}
        breakpoints={{ '576px': '100vw' }}
        draggable={false}
        resizable={false}
        modal
        className="border-0 shadow"
        headerClassName="border-0 pb-0 fw-bold"
        contentClassName="pt-3"
        contentStyle={{ overflowY: 'auto', maxHeight: '75vh' }}
        footer={
          <div className="d-flex justify-content-end pt-2">
            <Button
              label="Cerrar"
              className="p-button-outlined"
              style={{
                color: 'var(--color-secondary)',
                borderColor: 'var(--color-secondary)',
              }}
              onClick={handleCloseDocsDialog}
            />
          </div>
        }
      >
        {renderDocsDialogContent()}
      </Dialog>
    </div>
  );
}
