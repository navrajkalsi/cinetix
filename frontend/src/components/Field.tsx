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
  function visit() {
    console.log(`visiting ${link}`);
  }

  return (
    <div className="field" onClick={visit}>
      <span className="field-name">{name}</span>
      <span className="field-separator"></span>
      <span className={link === null ? "field-value" : "field-value link"}>
        {value}
      </span>
    </div>
  );
}
