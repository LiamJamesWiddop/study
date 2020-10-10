import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, ManyToMany} from "typeorm";

@Entity()
export default  class Flag extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    table: string;

    @Column({ default: 0 })
    entry_id: number;

    @Column({ default: 0 })
    time: number;

    @Column({ default: "" })
    text: string;
}