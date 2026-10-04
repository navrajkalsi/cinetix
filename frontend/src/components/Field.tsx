import { Link } from "react-router";
import "./Field.css";

export default function Field({
  name,
  value,
  link,
}: {
  name: string;
  value: string;
  link: string | null;
}) {
  return (
    <div className="field">
      <span className="field-name">{name}</span>
      <span className="field-separator"></span>
      {link === null ? (
        <span className="field-value">{value}</span>
      ) : (
        <span className="field-value link">
          <Link to={link} className="nav-link">
            {value}
          </Link>
        </span>
      )}
    </div>
  );
}
