import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Device {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    type: string;

    @Column('text')
    status: string;

    @Column('text')
    owner: string;

    @Column('text')
    image: string;
}
