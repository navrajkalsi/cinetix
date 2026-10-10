// Model with common fields for all format models.
interface FormatBase {
  name: string;
}

// Model recived from database api
export interface Format extends FormatBase {
  id: number;
}

// Model for creating a new format in the database from user input
export interface FormatCreate extends FormatBase { }
