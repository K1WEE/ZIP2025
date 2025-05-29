export interface AuthInput{
    email: string,
    password: string,
}

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    is_active: boolean;
    created_at: Date;
}