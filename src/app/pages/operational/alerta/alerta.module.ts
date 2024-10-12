export interface Alerta{
  id:number
  name:string,
  description:string,
  date: Date | string;  // Permitir que sea Date o string
  isRead:Boolean,
  animalId:number,
  categoryAlertId:number,
  usersId:number
}

