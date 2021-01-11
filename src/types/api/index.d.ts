interface LoginRequest {
    email: string
    password: string
}

interface LoginResponse {
    jwt: string
}

interface JWTPayload {
    userId: string
}

interface IUser {
    id: string
    email: string
}
