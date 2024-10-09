import { Person } from "../person/person.module"

export interface  User{
  id: number;
  username: string;
  password:string; 
  personId: number;
}
