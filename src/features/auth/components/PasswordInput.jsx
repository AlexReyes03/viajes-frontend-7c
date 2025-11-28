import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';

export default function PasswordInput({ id, label, value, onChange, onKeyDown, className = '', placeholder = ' ' }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="form-floating position-relative mb-3">
      <input id={id} type={visible ? 'text' : 'password'} className={`form-control pe-5 ${className}`} placeholder={placeholder} autoComplete="off" spellCheck="false" value={value} onChange={onChange} onKeyDown={onKeyDown} />
      <label htmlFor={id}>{label}</label>

      <div className="position-absolute end-0 top-50 translate-middle-y me-3 d-flex align-items-center text-muted" style={{ cursor: 'pointer', zIndex: 5 }} onClick={() => setVisible(!visible)} title={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
        <Icon path={visible ? mdiEye : mdiEyeOff} size={1} />
      </div>
    </div>
  );
}
