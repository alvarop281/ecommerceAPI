export interface User{
    id?: number;
    email: string;
    password: string;
    full_name: string;
    dni: string;
    phone_number: string;
    type_of_user: string;
    created_at: Date;
}