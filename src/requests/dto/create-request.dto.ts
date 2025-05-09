import { IsDate, IsInt, IsString, Min } from "class-validator";

export class CreateRequestDto {

    @IsString()
    readonly id: string;
    
    @IsString()
    readonly user_email: string;

    @IsDate()
    readonly date_Start: Date;

    @IsDate()
    readonly date_Finish: Date;

    @IsString()
    readonly status: string;

    @IsString()
    readonly admin_comment: string;
}