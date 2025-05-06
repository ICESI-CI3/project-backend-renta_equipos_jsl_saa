import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ContractDevice {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    contract_id: string;

    @Column("text")
    device_id: string;

    @Column("text")
    deviceName: string;

    @Column("text")
    delivey_status: string;
}
