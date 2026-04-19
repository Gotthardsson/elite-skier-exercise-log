export default function SelectField({
  label,
  value,
  onChange,
  options,
  className = "",
}) {
  return (
    <div className={`drop-down-button ${className}`}>
      {label && <label className="label-for-time-filters">{label}</label>}
      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
