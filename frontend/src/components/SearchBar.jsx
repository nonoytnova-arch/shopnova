import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Submitting navigates to /products?search=... so results are a real,
// shareable/bookmarkable URL rather than hidden client-only state.
export default function SearchBar({ className = '', initialValue = '', onSubmitted }) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set('search', value.trim());
    navigate(`/products?${params.toString()}`);
    if (onSubmitted) onSubmitted();
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        type="search"
        className="form-input"
        placeholder="Search products..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}
