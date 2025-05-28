import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Request {
    @PrimaryGeneratedColumn('uuid')
    id: string;

   @Column('text')
    user_email: string;

    @Column('text')
    date_start: string;

    @Column('text')
    date_finish: string;

    @Column('text')
    status: string;

    @Column('text')
    admin_comment: string;

}
