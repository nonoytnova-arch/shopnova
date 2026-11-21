import { useState } from 'react';

export default function PasswordInput({ value, onChange, name = 'password', required = false, minLength, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-with-action">
      <input
        type={visible ? 'text' : 'password'}
        className="form-input"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        autoComplete="current-password"
      />
      <button
        type="button"
        className="input-action-btn"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
