import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class School extends BaseEntity {
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
    postal: number

    @Column()
    description: string
}
