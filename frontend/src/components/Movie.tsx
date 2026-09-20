import type Movie from "../models/Movie";
import Field from "./Field";

export default function Movie({ movie }: { movie: Movie }) {
  return (
    <div>
      <Field name="Name" value={movie.name} />
    </div>
  );
}
