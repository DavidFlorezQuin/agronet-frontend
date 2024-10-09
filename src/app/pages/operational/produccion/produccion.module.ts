export interface Productions {
  id: number,
  typeProduction: string,
  stock: number,
  measurement: string ,
  description: string ,
  quantityTotal: number ,
  expirateDate?: Date;
  animalId: number 
}
