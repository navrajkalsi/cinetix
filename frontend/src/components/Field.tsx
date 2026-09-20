import "./Field.css";

export default function Field({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  return (
    <div className="field">
      <span className="field-name">{name}</span>
      <span className="field-separator">: </span>
      <span className="field-value">{value}</span>
    </div>
  );
}
