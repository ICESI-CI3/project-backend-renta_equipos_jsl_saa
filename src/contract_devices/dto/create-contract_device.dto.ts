import { IsString } from "class-validator";

export class CreateContractDeviceDto {
    @IsString()
    readonly contract_id: string;

    @IsString()
    readonly device_id: string;

    @IsString()
    readonly deviceName: string;

    @IsString()
    readonly delivey_status: string;

    
}