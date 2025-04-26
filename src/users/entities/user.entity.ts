import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text', { unique: true })
    email: string;

    @Column('text', { select: false })
    password : string;

    @Column('text')
    cellphone: string;

    @Column('text')
    address: string;

    @Column('text')
    role: string;
}