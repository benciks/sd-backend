import { User } from '../../db/entity/user'

declare global {
    namespace Express {
        export interface Request {
            getUser?: () => Promise<User>
            getUserID?: () => string | null
        }
    }
}
