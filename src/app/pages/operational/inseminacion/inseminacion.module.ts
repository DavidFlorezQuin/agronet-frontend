import { Animal } from './animal.model';

export interface Insemination {
  id: number;
  date: Date;
  observation: string;
  FatherId: number;
  father: Animal;
  MotherId: number;
  mother: Animal;
}
