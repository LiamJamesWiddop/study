import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, JoinTable, ManyToOne, ManyToMany} from "typeorm";
import table_column from "./diagnostic";
import Item from "./item";

@Entity()
export default class Table extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    name: string;

    @OneToMany(Type=>table_column,table_column => table_column)
    default: table_column[];
}