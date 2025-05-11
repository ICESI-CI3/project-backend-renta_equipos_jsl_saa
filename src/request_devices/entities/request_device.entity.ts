import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RequestDevice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    request_id: string;

    @Column('text')
    device_id: string;

    @Column('text')
    device_name: string;



}