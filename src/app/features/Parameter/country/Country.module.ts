import { Continent } from "../continent/Continent.module"

export interface Country{
    id:number
    name: string,
    countryCode: string,
    continentId: number

}
