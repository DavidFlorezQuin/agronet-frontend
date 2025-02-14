export interface Insemination {
  id: number;
  description: string;
  semenId: number | null;
  motherId: number;
  result:string;
  inseminationType: string;
  state?:boolean;
  mother?:string;
  semen?:string;
}

