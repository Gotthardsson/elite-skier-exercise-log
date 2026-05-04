export interface SessionType {
  id?: number;
  userId: number;
  activityId: number;
  templateId?: number;

  // Datum och tid
  date: string; // Mappar mot 'scheduled_date'
  timeOfDay?: string; // t.ex. "Förmiddag", "Eftermiddag"

  // Status
  isLogged: boolean; // Mappar mot 'is_logged' (ersätter isCompleted)

  // Kommentarer (Vi har nu två olika i DB)
  description?: string; // Mappar mot 'comment' (planeringen)
  loggedComment?: string; // Mappar mot 'logged_comment' (efter passet)

  // Feedback/Känsla
  feeling?: number; // Mappar mot 'physical_rpe' (1-10)
  mentalRpe?: number; // Mappar mot 'mental_rpe'

  // Zoner - Vi speglar DTO:ns struktur här för att göra mappningen enkel
  plannedZones: ZoneType;
  actualZones: ZoneType;
}

export interface ZoneType {
  a1: number;
  a2: number;
  a3Minus: number;
  a3: number;
  a3Plus: number;
  comp: number;
}
