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
    img: string
    password: string
}

interface IArticle {
    id: number
    name: string
    author: string
    url: string
    img: string
    content: string
    updatedAt: Date
    status: string
}

interface ISchool {
    id: number
    name: string
    url: string
    address: string
    city: string
    postal: string
    img: string
    status: string
}

interface IUserInvite {
    id: string
    email: string
    token: string
    validUntil: Date
}
