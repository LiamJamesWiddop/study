import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, ManyToOne, ManyToMany} from "typeorm";
import disease from "./disease"
import Drug from "./drug";

@Entity()
export default  class Symptom extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    name: string;

    @Column({ default: "" })
    description: string;

    @Column({ default: "" })
    epidemiology: string;

    @ManyToMany(type => Drug, Drug => Drug.symptom,{
        eager:true
    })
    drug: Drug[];

    @ManyToMany(type => disease, disease => disease.symptom,{
        eager:true
    })
    disease: disease[];
}