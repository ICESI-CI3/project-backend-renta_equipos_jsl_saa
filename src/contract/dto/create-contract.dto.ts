import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateContractDto {
    @IsString()
    readonly id: string;

    @IsString()
    readonly user_email: string;

    @IsString()
    readonly request_id: string;

    @IsDate()
    readonly date_Start: Date;

    @IsDate()
    readonly date_Finish: Date;


    @IsString()
    readonly status: string;

    @IsOptional()
    @IsString()
    readonly client_signature?: string;
}
