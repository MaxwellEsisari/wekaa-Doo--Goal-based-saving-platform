export interface SignupRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;  
  imageUrl?: string;     
}
