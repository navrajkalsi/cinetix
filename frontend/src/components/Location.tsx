import type Location from "../models/Location";
import Field from "./Field";

export default function Location({ location }: { location: Location }) {
  return (
    <div>
      <Field name="Name" value={location.name} />
    </div>
  );
}
