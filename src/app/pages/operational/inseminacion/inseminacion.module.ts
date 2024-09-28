import { Animal } from "../animal/animal.module"; 

export interface Insemination {
  id: number;
  description: string;
  FatherId: number;
  father?: Animal;
  MotherId: number;
  mother: Animal;
  result:string;
  inseminationType: string;
}
/**  public string Description { get; set; }

  public int SemenId { get; set; }
  public Animals Semen { get; set; }

  public int MotherId { get; set; }
  public Animals Mother { get; set; }

  public string Result { get; set; }
  public string InseminationType {get; set;} */