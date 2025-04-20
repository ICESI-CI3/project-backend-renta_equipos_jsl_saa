import { IsInt, IsString, Min } from "class-validator";

export class CreateDeviceDto {
    
    @IsString()
    readonly name: string;

    @IsString()
    readonly description: string;

    @IsString()
    readonly type: string;

    @IsString()
    readonly status: string;

    @IsInt()
    @Min(0, { message: 'El stock no puede ser menor a 0' })
    readonly stock: number;

    @IsString()
    readonly image: string;
}