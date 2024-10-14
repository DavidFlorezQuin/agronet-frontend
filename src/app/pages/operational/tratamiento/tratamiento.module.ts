export interface Treatments {
  id: number,
  description: string ,
  finishiedDate: Date | string ,
  startDate: Date | string,
  animalDiagnosticsId: number,
  name: string,
  state:boolean
}
