import { Person } from "../person/person.module"

export interface  User{
  id: number;
  userName: string;
  password?: string;
  state: boolean;

}
