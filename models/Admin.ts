import { FormsModule } from "@angular/forms";
export interface Admin{
id: number;
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}