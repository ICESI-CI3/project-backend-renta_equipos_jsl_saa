import { IsDate, IsInt, IsString, Min } from "class-validator";

export class CreateRequestDto {

    @IsString()
    readonly id: string;
    
    @IsString()
    readonly user_Document: string;

    @IsDate()
    readonly date_Request: Date;

    @IsString()
    readonly status: string;

    @IsString()
    readonly admin_comment: string;
}