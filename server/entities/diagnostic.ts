import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, ManyToMany} from "typeorm";
import disease from "./disease";

@Entity()
export default class Diagnostic extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    name: string;

    @Column({ default: "" })
    description: string;

    @ManyToMany(type => disease, disease => disease.diagnostic)
    disease: disease[];
}