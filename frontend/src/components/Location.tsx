import type Location from "../models/Location";
import Field from "./Field";
import "./Location.css";

export default function Location({ location }: { location: Location }) {
  return (
    <>
      <div className="location-banner"></div>
      <div className="location-fields">
        <Field name="Name" value={location.name} />
      </div>
    </>
  );
}
