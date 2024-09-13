import { ModuloM } from "./ModuloM.module";
import { View } from "./Views.module";

  export interface RoleMenu {
    roleId: number;
    roleName: string;
    modulo: ModuloM[]; 
  }
  