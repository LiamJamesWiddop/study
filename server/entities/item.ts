import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, JoinTable, ManyToOne, ManyToMany} from "typeorm";
import Folder from "./folder";
import Table from "./table";
import Deck from "./deck";
import Table_entry from "./table_entry";

@Entity()
export default class Item extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    name: string;

    @ManyToOne(type => Deck, Deck => Deck.root_items)
    deck: Deck;

    @ManyToOne(Type=>Table,Table=>Table, {
        cascade:true,
    })
    table: Table;
    
    @OneToMany(Type=>Table_entry,Table_entry=>Table_entry.item, {
        cascade:true,
    })
    entries: Table_entry[];

    @ManyToOne(type => Folder, Folder => Folder.items)
    folder: Folder; 
}