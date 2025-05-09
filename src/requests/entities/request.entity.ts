import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Request {
    @PrimaryGeneratedColumn('uuid')
    id: string;

   @Column('text')
    user_email: string;

    @Column('date')
    date_Start: Date;

    @Column('date')
    date_Finish: Date;

    @Column('text')
    status: string;

    @Column('text')
    admin_comment: string;

}
