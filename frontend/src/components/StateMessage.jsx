// One shared component for the three states every data-driven page needs:
// loading, empty, and error. Keeps that look consistent app-wide.
export default function StateMessage({ type = 'loading', title, description, action }) {
  const icon = { loading: null, empty: '🛒', error: '⚠️' }[type];

  return (
    <div className="state-message">
      {type === 'loading' ? <div className="spinner" /> : <div className="state-icon">{icon}</div>}
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
