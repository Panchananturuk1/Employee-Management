export type UserRole = 'admin' | 'user';

export interface AppUser {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: UserRole;
}
