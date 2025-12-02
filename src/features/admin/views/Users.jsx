import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import Icon from '@mdi/react';
import { mdiMagnify, mdiCardAccountDetails, mdiCar } from '@mdi/js';
import DataTable from '../components/DataTable';
import { UserService } from '../../../api/user/user.service';
import { DriverService } from '../../../api/driver/driver.service';
import { useAuth } from '../../../contexts/AuthContext';

// Admin users management view
export default function Users() {
  const toast = useRef(null);
  const { user: currentUser } = useAuth();
  // State for users and filters
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Vehicle View Dialog
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);

  // Fetch users on mount
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserService.getAllUsers();
      if (response && response.data) {
        // Transform data for UI compatibility
        const transformedUsers = response.data
          .filter((user) => user.id !== currentUser?.id) // Filter out current user
          .map((user) => ({
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
  const handleEdit = async (user) => {
    setCurrentStep(1);
    
    if (user.type === 'Conductor') {
      setLoading(true);
      try {
        const data = await DriverService.getDriverFullInfo(user.id);
        // Ensure we handle missing data gracefully
        const vehicle = data.vehicles && data.vehicles.length > 0 ? data.vehicles[0] : {};
        const profile = data.driverProfile || {};
        
        setSelectedUser({
          ...user,
          name: user.originalName,
          type: 'CONDUCTOR',
          // Driver fields
          driverProfileId: profile.driverProfileId,
          licenseNumber: profile.licenseNumber || '',
          vehicleId: vehicle.id,
          vehicleBrand: vehicle.brand || '',
          vehicleModel: vehicle.model || '',
          vehicleYear: vehicle.year || '',
          vehiclePlate: vehicle.plate || '',
          vehicleColor: vehicle.color || '',
        });
        setShowEditDialog(true);
      } catch (error) {
        console.error('Error fetching driver details:', error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los detalles del conductor' });
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedUser({
        ...user,
        name: user.originalName,
        type: user.role ? user.role.name.toUpperCase() : 'CLIENTE',
      });
      setShowEditDialog(true);
    }
  };

  // Handle View PDF
  const handleViewPdf = async (user) => {
    setLoading(true);
    try {
      const data = await DriverService.getDriverFullInfo(user.id);
      console.log('Driver Data for PDF:', data); // Debug log
      const doc = data.documents && data.documents.length > 0 ? data.documents[0] : null;
      
      if (doc && doc.id) {
        const blob = await DriverService.downloadDocument(doc.id);
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        toast.current?.show({ severity: 'warn', summary: 'Sin documento', detail: 'El conductor no tiene documentos registrados.' });
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el documento' });
    } finally {
      setLoading(false);
    }
  };

  // Handle View Vehicle (Read Only)
  const handleViewVehicle = async (user) => {
    setLoading(true);
    try {
      const data = await DriverService.getDriverFullInfo(user.id);
      console.log('Full Driver Info (Vehicle View):', data); // Debug log requested by user

      const vehicle = data.vehicles && data.vehicles.length > 0 ? data.vehicles[0] : {};
      const profile = data.driverProfile || {};
      
      setSelectedUser({
        ...user,
        name: user.originalName,
        licenseNumber: profile.licenseNumber || 'N/A',
        vehicleBrand: vehicle.brand || 'N/A',
        vehicleModel: vehicle.model || 'N/A',
        vehicleYear: vehicle.year || 'N/A',
        vehiclePlate: vehicle.plate || 'N/A',
        vehicleColor: vehicle.color || 'N/A',
      });
      setShowVehicleDialog(true);
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos del vehículo' });
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle user status
  const handleToggleStatus = async (user) => {
    try {
      const updatedUser = { ...user, status: !user.status };
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
      // Construct user payload
      let roleObj = selectedUser.role;
      if (selectedUser.type === 'ADMIN') roleObj = { id: 1, name: 'ADMIN' };
      else if (selectedUser.type === 'CLIENTE') roleObj = { id: 2, name: 'CLIENTE' };
      else if (selectedUser.type === 'CONDUCTOR') roleObj = { id: 3, name: 'CONDUCTOR' };

      const userPayload = {
        ...selectedUser,
        name: selectedUser.name,
        role: roleObj,
      };

      // Clean up aux fields for User payload
      delete userPayload.originalName;
      delete userPayload.statusStr;
      delete userPayload.driverProfileId;
      delete userPayload.licenseNumber;
      delete userPayload.vehicleId;
      delete userPayload.vehicleBrand;
      delete userPayload.vehicleModel;
      delete userPayload.vehicleYear;
      delete userPayload.vehiclePlate;
      delete userPayload.vehicleColor;

      await UserService.updateUser(userPayload);

      // Update Driver Info if applicable
      if (selectedUser.type === 'CONDUCTOR') {
        if (selectedUser.driverProfileId) {
          await DriverService.updateDriverLicense(selectedUser.driverProfileId, selectedUser.licenseNumber);
        }
        if (selectedUser.vehicleId) {
          await DriverService.updateVehicle(selectedUser.vehicleId, {
             brand: selectedUser.vehicleBrand,
             model: selectedUser.vehicleModel,
             year: selectedUser.vehicleYear,
             plate: selectedUser.vehiclePlate,
             color: selectedUser.vehicleColor,
             active: true
          });
        }
      }

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
        {loading && !showEditDialog && !showVehicleDialog ? (
          <div className="d-flex justify-content-center py-5">
            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
          </div>
        ) : (
          <DataTable 
             data={filteredUsers} 
             onEdit={handleEdit} 
             onToggleStatus={handleToggleStatus} 
             onViewPdf={handleViewPdf}
             onViewVehicle={handleViewVehicle}
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
            {currentStep === 1 && (
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
            )}

            {currentStep === 2 && selectedUser.type === 'CONDUCTOR' && (
              <div className="row g-3">
                 <div className="col-12">
                      <h6 className="fw-bold text-secondary mb-3 border-bottom pb-2">Información de Conductor</h6>
                 </div>
                 <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">No. Licencia</label>
                    <InputText value={selectedUser.licenseNumber} onChange={(e) => setSelectedUser(prev => ({ ...prev, licenseNumber: e.target.value }))} className="w-100" />
                 </div>

                 <div className="col-12 mt-4">
                      <h6 className="fw-bold text-secondary mb-3 border-bottom pb-2">Datos del Vehículo</h6>
                 </div>

                 <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Marca</label>
                    <InputText value={selectedUser.vehicleBrand} onChange={(e) => setSelectedUser(prev => ({ ...prev, vehicleBrand: e.target.value }))} className="w-100" />
                 </div>
                 <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Modelo</label>
                    <InputText value={selectedUser.vehicleModel} onChange={(e) => setSelectedUser(prev => ({ ...prev, vehicleModel: e.target.value }))} className="w-100" />
                 </div>
                 <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Año</label>
                    <InputText value={selectedUser.vehicleYear} onChange={(e) => setSelectedUser(prev => ({ ...prev, vehicleYear: e.target.value }))} className="w-100" type="number" />
                 </div>
                 <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Placa</label>
                    <InputText value={selectedUser.vehiclePlate} onChange={(e) => setSelectedUser(prev => ({ ...prev, vehiclePlate: e.target.value.toUpperCase() }))} className="w-100" />
                 </div>
                 <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Color</label>
                    <InputText value={selectedUser.vehicleColor} onChange={(e) => setSelectedUser(prev => ({ ...prev, vehicleColor: e.target.value }))} className="w-100" />
                 </div>
              </div>
            )}

            {/* Step Indicators for Conductor (Moved to Bottom) */}
            {selectedUser.type === 'CONDUCTOR' && (
               <div className="d-flex justify-content-center gap-2 mt-3">
                 <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: currentStep === 1 ? 'var(--color-lime-shade-2)' : '#dee2e6', transition: 'background-color 0.3s' }} />
                 <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: currentStep === 2 ? 'var(--color-lime-shade-2)' : '#dee2e6', transition: 'background-color 0.3s' }} />
               </div>
            )}

            {/* Responsive footer buttons */}
            <div className="d-flex align-items-center justify-content-between pt-4 mt-2 border-top">
              {/* Left Side: Back Button (Only Step 2) */}
              <div>
                {currentStep === 2 && (
                  <Button 
                    icon="pi pi-arrow-left" 
                    className="p-button-text p-button-secondary p-button-sm" 
                    tooltip="Atrás"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => setCurrentStep(1)} 
                  />
                )}
              </div>

              {/* Right Side: Action Buttons */}
              <div className="d-flex gap-2">
                <Button
                  label="Cancelar"
                  className="p-button-outlined fw-bold"
                  style={{ color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }}
                  onClick={() => setShowEditDialog(false)}
                />
                
                {selectedUser.type === 'CONDUCTOR' && currentStep === 1 ? (
                  <Button label="Siguiente" className="btn-lime" onClick={() => setCurrentStep(2)} />
                ) : (
                  <Button label="Guardar" className="btn-lime" onClick={handleSaveUser} />
                )}
              </div>
            </div>
          </div>
        )}
      </Dialog>
      
      {/* Vehicle Data Dialog (Read Only) */}
      <Dialog
        header="Datos del Vehículo"
        visible={showVehicleDialog}
        onHide={() => setShowVehicleDialog(false)}
        style={{ width: '95vw', maxWidth: '500px' }}
        breakpoints={{ '768px': '95vw' }}
        draggable={false}
        resizable={false}
        modal
        className="border-0 shadow"
        headerClassName="border-0 pb-0 fw-bold"
        contentClassName="pt-4"
      >
         {selectedUser && (
             <div className="d-flex flex-column gap-4">
               {/* License Section */}
               <div className="bg-light p-3 rounded-3 d-flex align-items-center gap-3 border">
                  <div className="bg-white p-2 rounded-circle shadow-sm">
                    <Icon path={mdiCardAccountDetails} size={1.2} className="text-secondary" />
                  </div>
                  <div>
                    <label className="small text-secondary fw-bold d-block text-uppercase" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>Licencia de Conducir</label>
                    <span className="fs-5 fw-bold text-dark">{selectedUser.licenseNumber || 'N/A'}</span>
                  </div>
               </div>

               {/* Vehicle Section */}
               <div>
                 <h6 className="fw-bold text-secondary mb-3 d-flex align-items-center gap-2">
                    <Icon path={mdiCar} size={0.8} /> Detalles del Vehículo
                 </h6>
                 
                 <div className="card border-0 shadow-sm" style={{backgroundColor: '#f8f9fa'}}>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-6">
                                <label className="small text-secondary d-block">Marca</label>
                                <span className="fw-semibold text-dark">{selectedUser.vehicleBrand}</span>
                            </div>
                            <div className="col-6">
                                <label className="small text-secondary d-block">Modelo</label>
                                <span className="fw-semibold text-dark">{selectedUser.vehicleModel}</span>
                            </div>
                            <div className="col-6">
                                <label className="small text-secondary d-block">Color</label>
                                <div className="d-flex align-items-center gap-2">
                                    <div style={{width: '12px', height: '12px', borderRadius: '50%', backgroundColor: selectedUser.vehicleColor?.toLowerCase() === 'blanco' ? '#eee' : selectedUser.vehicleColor, border: '1px solid #ddd'}}></div>
                                    <span className="fw-semibold text-dark">{selectedUser.vehicleColor}</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <label className="small text-secondary d-block">Año</label>
                                <span className="fw-semibold text-dark">{selectedUser.vehicleYear}</span>
                            </div>
                            <div className="col-12 pt-2">
                                <div className="d-flex flex-column align-items-center justify-content-center p-2 bg-white border rounded">
                                    <label className="small text-secondary text-uppercase fw-bold" style={{fontSize: '0.65rem'}}>Placa</label>
                                    <span className="fs-4 fw-bold" style={{letterSpacing: '2px', color: '#333'}}>{selectedUser.vehiclePlate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
               </div>

               <div className="d-flex justify-content-end pt-2">
                 <Button label="Cerrar" className="p-button-secondary" onClick={() => setShowVehicleDialog(false)} />
               </div>
             </div>
         )}
      </Dialog>
    </div>
  );
}
