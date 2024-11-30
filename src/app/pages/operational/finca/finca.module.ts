
export interface Finca {
  id: number;
  name: string;
  photo:string,
  hectare: number;
  description: string;
  code:'';
  City:string | null, 
  cityId: number; // Propiedad opcional
  state: boolean
}

