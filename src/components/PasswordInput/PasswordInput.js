import React, { useState } from 'react';
import './PasswordInput.css';

const PasswordInput = ({ value, onChange, name, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-container">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control" // Utilise ta classe CSS habituelle
        required
      />
      <button
        type="button"
        className="visibility-toggle"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex="-1" // Évite que le bouton soit sélectionné par 'Tab'
      >
        {showPassword ? "👁️" : "🔒"}
      </button>
    </div>
  );
};

export default PasswordInput;