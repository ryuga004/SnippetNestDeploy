export interface updateUserType {
    avatar: string,
    coverImage: string,
    bio: string,
    username: string,
    email: string,
    role: "ADMIN" | "USER"
}