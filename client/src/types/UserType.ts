export interface UserType {
  id: number;
  name: string;
  role: "atlet" | "coach";
  email: string;
  coachId: number | null;
}
