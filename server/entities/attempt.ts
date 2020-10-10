import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, JoinTable, ManyToOne, ManyToMany, Any} from "typeorm";
import Question from "./question"

@Entity()
export default class Attempt extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    time: number;

    @Column({ default: false })
    correct: boolean;

    @ManyToOne(type=>Question,Question=>Question.attempt,{onDelete:'CASCADE'})
    question: Question;

}