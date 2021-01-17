import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Article extends BaseEntity implements IArticle {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    url: string

    @Column()
    content: string

    @UpdateDateColumn()
    updatedAt: Date
}
