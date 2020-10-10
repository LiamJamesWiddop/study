import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, ManyToOne, ManyToMany} from "typeorm";
import disease from "./disease"

@Entity()
export default  class NonDrug extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    name: string;

    @Column({ default: "" })
    rationale: string;

    @ManyToMany(type => disease, disease => disease.nonDrug)
    disease: disease[];
}