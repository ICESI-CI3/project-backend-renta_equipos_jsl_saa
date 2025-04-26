import { IsString } from "class-validator";

export class CreateDeviceDto {

    @IsString()
    readonly name: string;

    @IsString()
    readonly description: string;

    @IsString()
    readonly type: string;

    @IsString()
    readonly status: string;

    @IsString()
    readonly owner: string;

    @IsString()
    readonly image: string;
}
