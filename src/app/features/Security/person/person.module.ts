import { DataType } from "datatables.net";

export interface Person{
    id: number, 
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    document: string,
    typeDocument: string,
    direction: string,
    phone: string,
    birthday: string
}