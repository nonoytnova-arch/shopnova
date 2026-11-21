export default function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  function dec() {
    if (value > min) onChange(value - 1);
  }
  function inc() {
    if (value < max) onChange(value + 1);
  }
  return (
    <div className="qty-stepper">
      <button type="button" onClick={dec} disabled={value <= min} aria-label="Decrease quantity">−</button>
      <span>{value}</span>
      <button type="button" onClick={inc} disabled={value >= max} aria-label="Increase quantity">+</button>
    </div>
  );
}
