import { Person } from "../person/person.module"

export interface  User{
  id: number;
  UserName: string;
  PersonId: number;
  password?: string;
  

}
