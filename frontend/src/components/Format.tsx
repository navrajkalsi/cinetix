import type Format from "../models/Format";
import Field from "./Field";
import "./Format.css";

export default function Format({ format }: { format: Format }) {
  return (
    <>
      <div className="format-banner"></div>
      <div className="format-fields">
        <Field name="Name" value={format.name} />
      </div>
    </>
  );
}
