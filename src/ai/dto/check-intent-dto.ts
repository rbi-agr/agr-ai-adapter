import { IsNotEmpty, IsString } from 'class-validator';
export class CheckIntentDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}