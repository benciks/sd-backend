import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Article extends BaseEntity implements IArticle {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    author: string

    @Column({ unique: true })
    url: string

    @Column()
    img: string

    @Column()
    content: string

    @UpdateDateColumn()
    updatedAt: Date

    @Column()
    status: string
}
