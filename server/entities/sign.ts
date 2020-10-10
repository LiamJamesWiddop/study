import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, ManyToMany} from "typeorm";
import disease from "./disease"

@Entity()
export default  class Sign extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    name: string;

    @Column({ default: "" })
    description: string;

    @Column({ default: "" })
    epidemiology: string;

    @ManyToMany(type => disease, disease => disease.sign)
    disease: disease[];
}