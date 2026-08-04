import { FormsModule } from "@angular/forms";
export interface Interviewer{
    id: number;
  name: string;
  email: string;
  password: string;
  level: string;
  skillset: string;
  years_of_exp: number;
  is_avaliable: boolean;
  joined: number;
}