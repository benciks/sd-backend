import { Entity, PrimaryColumn, BaseEntity, Column } from 'typeorm'
import { randId } from '../helpers'

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

    @Column({ nullable: true })
    totpSecret: string
}
