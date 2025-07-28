export type UserType = {
    id: string;
    name: string;
    slug: string;
    email: string;
    password: string;
    picture?: string;
    banner?: string;
    bio?: string;
    createdAt: Date;
}

export type CreateUserType = {
    name: string;
    email: string;
    password: string;
}