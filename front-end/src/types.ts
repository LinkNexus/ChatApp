export interface User {
    id: number;
    email: string;
    name: string;
    roles: string[];
    isVerified: boolean;
    bio: string;
}