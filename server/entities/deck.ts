import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, JoinTable, ManyToOne, ManyToMany} from "typeorm";
import Item from "./item";
import Folder from "./folder";

@Entity()
export default class Deck extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    name: string;

    @OneToMany(type => Folder, Folder => Folder.deck, {
        cascade: true,
        eager:true,
    })
    @JoinColumn()
    root_folders: Folder[];

    @OneToMany(type => Item, Item => Item.deck, {
        cascade: true,
        eager:true,
    })
    @JoinColumn()
    root_items: Item[];
}