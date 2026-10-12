import "./Select.css";

export default function Select({
  placeholder,
  name,
  options,
}: {
  placeholder: string;
  name: string;
  // array of id and names
  options: [number, string][];
}) {
  function handleFocus(e: React.FocusEvent<HTMLSelectElement>) {
    e.target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <label className="select-label">
      {placeholder}:
      <select name={name} className="select" onFocus={handleFocus} required>
        {options.map((option) => (
          <option key={option[0]} value={option[0]}>
            {option[1]}
          </option>
        ))}
      </select>
    </label>
  );
}
