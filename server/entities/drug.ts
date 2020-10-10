import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinTable, BaseEntity, ManyToOne, ManyToMany} from "typeorm";
import disease from "./disease";
import Symptom from "./symptom";

@Entity()
export default class Drug extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    name: string;

    @Column({ default: "" })
    action: string;

    @Column({ default: "" })
    indications: string;
    
    @Column({ default: "" })
    sideEffects: string;

    @ManyToMany(type => Symptom, Symptom => Symptom.drug, {
        cascade:true,
    })
    @JoinTable()
    symptom: Symptom[];

    @ManyToMany(type => disease, disease => disease.drug, {
        eager:true,
    })
    disease: disease[];
}