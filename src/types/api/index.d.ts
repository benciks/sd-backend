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
    name: string
    email: string
    password: string
}

interface IArticle {
    id: number
    name: string
    url: string
    content: string
    updatedAt: Date
}

interface ISchool {
    id: number
    name: string
    url: string
    address: string
    city: string
    postal: number
    description: string
}

interface IUserInvite {
    id: string
    email: string
    token: strink
    validUntil: Date
}
