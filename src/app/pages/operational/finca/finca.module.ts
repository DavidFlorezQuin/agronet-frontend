import { City } from "../../../features/Parameter/city/city.module";
import { User } from "../../../features/Security/users/User.module";

export interface Finca {
  id: number;
  name: string;
  dimension: number;
  description: string;
  
  userId: number;
  user?: User; 
  cityId?: number; // Propiedad opcional
  city?: City;// Suponiendo que quieres mostrar el nombre de la ciudad
   // Suponiendo que quieres mostrar el nombre del usuario
}

