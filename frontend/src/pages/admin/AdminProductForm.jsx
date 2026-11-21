import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import StateMessage from '../../components/StateMessage';

const emptyForm = { name: '', description: '', price: '', category: '', image_url: '', stock: '' };

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api
      .getProduct(id)
      .then((p) =>
        setForm({
          name: p.name,
          description: p.description || '',
          price: p.price,
          category: p.category || '',
          image_url: p.image_url || '',
          stock: p.stock
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock || 0)
    };
    try {
      if (isEdit) {
        await api.updateProduct(id, payload);
      } else {
        await api.createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <StateMessage type="loading" title="Loading product..." />;

  return (
    <div>
      <Link to="/admin/products" className="text-sm text-muted">← Back to Products</Link>
      <h2 className="mt-16 mb-16">{isEdit ? 'Edit Product' : 'Add Product'}</h2>

      <form onSubmit={handleSubmit} className="card card-pad" style={{ maxWidth: 560 }}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Stock</label>
            <input
              type="number"
              min="0"
              className="form-input"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <input className="form-input" name="category" value={form.category} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Image URL (optional)</label>
          <input className="form-input" name="image_url" value={form.image_url} onChange={handleChange} />
          <p className="text-sm text-muted mt-8">Leave blank to show a placeholder.</p>
        </div>

        {error && <p className="form-error mb-16">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
