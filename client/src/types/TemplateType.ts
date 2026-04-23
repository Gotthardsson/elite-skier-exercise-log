export interface Template {
  name: string;
  folder: string;
  sport: string;
  description: string;
  zones: {
    a1: number;
    a2: number;
    a3Minus: number;
    a3: number;
    a3Plus: number;
    comp: number;
  };
}
