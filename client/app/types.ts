export interface User {
    id: number;
    email: string;
    name: string;
    roles: string[];
    isVerified: boolean;
}

export interface UserCreate extends User {
    "@context": 'create';
    "@id": string;
    "@type": string;
}