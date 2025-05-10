import { IsDate, IsInt, IsString, Min } from "class-validator";

export class CreateRequestDto {

    @IsString()
    readonly id: string;
    
    @IsString()
    readonly user_email: string;

    @IsDate()
    readonly date_start: Date;

    @IsDate()
    readonly date_finish: Date;

    @IsString()
    readonly status: string;

    @IsString()
    readonly admin_comment: string;
}