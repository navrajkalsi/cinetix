import type Movie from "../models/Movie";
import Field from "./Field";
import "./Movie.css";

export default function Movie({ movie }: { movie: Movie }) {
  return (
    <>
      <div className="movie-banner"></div>
      <div className="movie-fields">
        <Field name="Name" value={movie.name} />
      </div>
    </>
  );
}
