export interface Alerta{
  id:number
  Name:string,
  description:string,
  date: Date | string;  // Permitir que sea Date o string
  isRead:Boolean,
  animalId:number | null,
  categoryAlertId:number,
  usersId:number,
  farmsId:number
}

