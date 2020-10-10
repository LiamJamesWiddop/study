import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, JoinTable, ManyToOne, ManyToMany} from "typeorm";
import Diagnostic from "./diagnostic";
import Drug from "./drug";
import nonDrug from "./nonDrug";
import Symptom from "./symptom";
import Sign from "./sign";

@Entity()
export default class Disease extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    name: string;

    @Column({ default: "" })
    pathophysiology: string;

    @Column({ default: "" })
    epidemiology: string;

    @Column({ default: "" })
    onset: string;

    @Column({ default: "" })
    presentation: string;

    @Column({ default: "" })
    treatment: string;

    @ManyToMany(type => Drug, Drug => Drug.disease, {
        cascade: true,
    })
    @JoinTable()
    drug: Drug[];

    @ManyToMany(type => nonDrug, nonDrug => nonDrug.disease, {
        cascade: true,
    })
    @JoinTable()
    nonDrug: nonDrug[];

    @ManyToMany(type => Diagnostic, Diagnostic => Diagnostic.disease, {
        cascade: true,
    })
    @JoinTable()
    diagnostic: Diagnostic;
    
    @ManyToMany(type => Symptom, Symptom => Symptom.disease, {
        cascade: true,
    })
    @JoinTable()
    symptom: Symptom[];
    
    @ManyToMany(type => Sign, Sign => Sign.disease, {
        cascade: true,
    })
    @JoinTable()
    sign: Sign[];

    static echo(){
        console.log("HI");
        return "hi"
    }
}