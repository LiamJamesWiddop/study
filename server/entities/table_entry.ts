import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, JoinTable, ManyToOne, ManyToMany} from "typeorm";
import Item from "./item";
import Table_column from "./table_column";

@Entity()
export default class Table_Entry extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    value: string;

    @ManyToOne(Type=>Item,Item=>Item.entries)
    item: Item;

    @ManyToOne(type=>Table_column, Table_column => Table_column.entries, {
        cascade:true,
        eager:true
    })
    column: Table_column;
}