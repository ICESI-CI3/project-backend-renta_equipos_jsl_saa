import { IsInt, IsString } from "class-validator";

export class CreateRequestDeviceDto {

    @IsString()
    readonly request_id: string;

    @IsString()
    readonly device_id: string;

    @IsString()
    readonly deviceName: string;
    
}