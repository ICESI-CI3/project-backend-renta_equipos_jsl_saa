import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Request {
    @PrimaryGeneratedColumn('uuid')
    id: string;

   @Column('text')
    user_email: string;

    @Column('date')
    date_start: Date;

    @Column('date')
    date_finish: Date;

    @Column('text')
    status: string;

    @Column('text')
    admin_comment: string;

}
