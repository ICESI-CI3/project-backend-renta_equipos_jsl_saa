import { Table, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contract {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    user_email: string;

    @Column('text')
    request_id: string;

    @Column('date')
    date_start: string;

    @Column('date')
    date_finish: string;

    @Column('text')
    status: string;

    @Column('text', { nullable: true })
    client_signature: string | null; // Optional field, can be null
}
