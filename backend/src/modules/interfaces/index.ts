//generict interfaces, all project can use them
export interface TokenProperties{
    userId: number;
    email: string;
    name: string;
    iat: Date;
    exp: Date;
}

export interface internal_process{
    user_id: number;
    email: string;
}