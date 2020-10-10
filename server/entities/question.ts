import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, JoinTable, ManyToOne, ManyToMany, Any} from "typeorm";
import Attempt from "./attempt"

@Entity()
export default class Question extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    table: string;

    @Column({ default: 0 })
    entry_id: number;

    @Column({ default: "" })
    field: string;

    @Column({ default: 0 })
    lastAttempt: number;

    @Column({ default: 0 })
    nextAttemptDelta: number;

    @Column({ default: 0 })
    correctRatio: number;

    @Column({ default: true })
    direction: boolean;

    @OneToMany(type => Attempt, Attempt=>Attempt.question, {
        eager:true,
        cascade:true
    })
    @JoinColumn()
    attempt: Attempt[];

    static async whereNot(id: number) {
        let questions
        if(id){
            questions = await this.createQueryBuilder("question")
            .where("question.id != :id", { id })
            .getMany();
        }else{
            questions = await this.find()
        }
        return questions
    }
}