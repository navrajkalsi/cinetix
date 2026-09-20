import type Format from "../models/Format";
import Field from "./Field";

export default function Format({ format }: { format: Format }) {
  return (
    <div>
      <Field name="Name" value={format.name} />
    </div>
  );
}
