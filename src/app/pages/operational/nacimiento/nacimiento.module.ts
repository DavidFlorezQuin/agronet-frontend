import { Animal } from "../animal/animal.module"

export interface Nacimiento{
    id: number,
    assistence:string,
    Result:number,
    Description:string,
    BirthWeight: number 
    Inseminacionid:string
    AnimalId?:number,
   
}