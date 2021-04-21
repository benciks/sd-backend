import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class School extends BaseEntity implements ISchool {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    url: string

    @Column()
    address: string

    @Column()
    city: string

    @Column()
    postal: string

    @Column()
    img: string

    @Column()
    status: string
}
