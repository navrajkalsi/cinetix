// Model with common fields for all movie models.
interface MovieBase {
  name: string;
  external_id: number;
  poster_path: string | null;
  release_date: string | null;
}

// Model recived from database api
export interface Movie extends MovieBase {
  id: number;
  backdrop_path: string | null;
  homepage: string | null;
  runtime: number | null;
  tagline: string | null;
}

// Model for creating a new movie in the database from user input
export interface MovieCreate extends MovieBase { }
