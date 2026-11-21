export default function OrderStatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}
