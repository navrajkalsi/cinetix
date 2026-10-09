// Model with common fields for all subsequent movie models.
interface MovieBase {
  name: string;
  poster_url?: string;
  external_id: string;
}

// Model recived from database api
export interface Movie extends MovieBase {
  id: number;
}

// Model for creating a new movie in the database from user input
export interface MovieCreate extends MovieBase { }
