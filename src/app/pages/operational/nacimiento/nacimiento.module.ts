import { Animal } from "../animal/animal.module"

export interface Nacimiento{
    id: number,
    assistence:string,
    result:number,
    description:string,
    birthWeight: number 
    inseminationId:number
    AnimalId: number | null;   
}