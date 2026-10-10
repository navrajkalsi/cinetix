// Model with common fields for all location models.
interface LocationBase {
  name: string;
  full_address: string;
  external_id: string;
}

// Model recived from database api
export interface Location extends LocationBase {
  id: number;
}

// Model for creating a new location in the database from user input
export interface LocationCreate extends LocationBase { }
