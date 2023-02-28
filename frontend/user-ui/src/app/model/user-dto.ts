export interface UserDto {
    id: number;
    firstName?: string;
    lastName?: string;
    username: string;
    email?: string;
    active?: boolean;
}

export interface UserFormDto {
    firstName?: string;
    lastName?: string;
    username: string;
    email?: string;
}
