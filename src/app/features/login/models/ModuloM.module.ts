import { View } from "./Views.module";

export interface ModuloM {
  id: number;
  name: string;
  description: string | null;
  order: number;
  views: View[]; 
  state: boolean;
}
