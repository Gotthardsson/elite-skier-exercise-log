export interface SessionType {
  //Måste mappa om i service sen så att det lirar med databasen.
  id?: number; // Valfri vid skapande (backend sätter ID)
  userId: number; // Vem äger passet?
  activityId: number; // Koppling till sport (t.ex. 1 för Skate)
  templateId?: number; // Om passet skapades från en mall
  title: string;
  description?: string;
  date: string; // ISO-sträng (t.ex. "2026-04-27")
  isCompleted: boolean; // Har passet körts?
  zones: {
    a1: number;
    a2: number;
    a3Minus: number;
    a3: number;
    a3Plus: number;
    comp: number;
  };
}
