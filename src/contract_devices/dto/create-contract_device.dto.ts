import { IsString } from "class-validator";

export class CreateContractDeviceDto {
    @IsString()
    readonly contract_id: string;

    @IsString()
    readonly device_id: string;

    @IsString()
    readonly device_name: string;

    @IsString()
    readonly delivery_status: string;

    
}