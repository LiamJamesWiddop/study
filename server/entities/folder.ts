import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, Tree, JoinTable, ManyToOne, ManyToMany, TreeParent, TreeChildren} from "typeorm";
import Item from "./item";
import Deck from "./deck";

@Entity()
export default class Folder extends BaseEntity {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    name: string;

    @ManyToOne(type => Deck, Deck => Deck.root_folders, {
        onDelete: 'CASCADE',
    })
    deck: Deck;

    @OneToMany(type => Folder, Folder => Folder.parent_id, {
        cascade: true,
    })
    @JoinColumn()
    subFolders: Folder[];

    @ManyToOne(type => Folder, Folder => Folder.id, {
        onDelete: 'CASCADE',
    })
    parent_id: number;

    @OneToMany(type => Item, Item => Item.folder, {
        cascade: true,
    })
    @JoinColumn()
    items: Item[];

    static async contents(id){
        console.log("FINDING WHERE ID",id);
        let where = {where:{id:id},relations: ["items", "subFolders"]};
        let folderFull = await Folder.findOne(where);
        return folderFull;
    }
}