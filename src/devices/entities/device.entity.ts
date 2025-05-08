import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Device entity representing a device in the system.
 * This entity is used to store device information in the database.
 * It includes properties such as id, name, description, type, status, stock, image, and slug.
 */
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
