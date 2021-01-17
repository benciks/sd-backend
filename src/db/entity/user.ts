import { Entity, PrimaryColumn, BaseEntity, Column } from 'typeorm'
import { randId } from '../helpers'
import bcrypt from 'bcrypt'

@Entity()
export class User extends BaseEntity implements IUser {
    @PrimaryColumn()
    id: string = randId()

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    static new(name: string, email: string, password: string) {
        const u = new User()
        Object.assign(u, { name, email })
        u.password = bcrypt.hashSync(password, 10)

        return u.save()
    }
}
