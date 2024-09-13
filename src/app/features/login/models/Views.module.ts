export interface View {
    name: string;
    description: string | null;
    order: number;
    views: View[];
    id: number;
    state: boolean;
    route:string
  }
  