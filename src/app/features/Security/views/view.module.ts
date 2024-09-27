import { Modulo } from "../modules/modulo.module";

export interface View {
    id: number, 
    name:string,
    description:string,
    route:string,
    moduleId:number
}