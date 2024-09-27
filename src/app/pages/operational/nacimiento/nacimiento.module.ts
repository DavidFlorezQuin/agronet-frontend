import { Animal } from "../animal/animal.module"

export interface Nacimiento{
    id: number,
    Assistence:string,
    Result:number,
    Description:string,
    BirthWeight: number 
    Inseminacionid:string
    AnimalId?:number,
    Animal?: Animal
}



/*
 public string Assistence {  get; set; }
 public double Result { get; set; }
 public string Description {  get; set; }

 public double BirthWeight { get; set; }

 public int InseminationId { get; set; }
 public Inseminations Insemination { get; set; }

 public int AnimalId { get; set; }
/ */