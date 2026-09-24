import type Movie from "../models/Movie";
import "./Movie.css";

export default function Movie({ movie }: { movie: Movie }) {
  return (
    <>
      <div className="movie-banner"></div>
      <div className="movie-fields">
        <span className="field-name">{movie.name}</span>
      </div>
    </>
  );
}
