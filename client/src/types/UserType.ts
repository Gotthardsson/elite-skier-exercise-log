export interface UserType {
  id: number;
  name: string;
  role: "athlete" | "coach";
  email: string;
  coachId: number;
}
