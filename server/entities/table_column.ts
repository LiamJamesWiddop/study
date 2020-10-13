import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, JoinTable, ManyToOne, ManyToMany} from "typeorm";
import Table from "./table";
import Table_entries from "./table_entry";

@Entity()
export default class Table_Column extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    name: string;

    @ManyToOne(type=>Table, Table => Table.default, {
        cascade:true
    })
    table: Table;

    @OneToMany(type=>Table_entries, Table_entries => Table_entries.column)
    entries: Table_entries[];
}