import { Entity, PrimaryColumn, BaseEntity, Column } from 'typeorm'
import { randId, randToken } from '../helpers'

@Entity()
export class UserInvite extends BaseEntity implements IUserInvite {
    @PrimaryColumn()
    id: string = randId()

    @Column()
    email: string

    @Column()
    token: string = randToken()

    @Column()
    validUntil: Date = new Date(new Date().getTime() + 1000 * 60 * 60 * 6)

    static async New(email: string) {
        const invite = new UserInvite()
        invite.email = email
        return invite.save()
    }
}
