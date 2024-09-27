import { City } from "../../../features/Parameter/city/city.module";
import { User } from "../../../features/Security/users/User.module";

export interface Finca {
  id: number;
  name: string;
  dimension: number;
  description: string;
  userId: number;
  cityId?: number; // Propiedad opcional
}

