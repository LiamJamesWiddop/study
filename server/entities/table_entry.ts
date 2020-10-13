import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, JoinTable, ManyToOne, ManyToMany} from "typeorm";
import Item from "./item";
import Table_column from "./table_column";

@Entity()
export default class Table_Entry extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    value: string;

    @ManyToOne(Type=>Item,Item=>Item.entries, {
        onDelete:"CASCADE",
    })
    item: Item;

    @ManyToOne(type=>Table_column, Table_column => Table_column.entries, {
        eager:true,
        onDelete:'CASCADE'
    })
    column: Table_column;
}