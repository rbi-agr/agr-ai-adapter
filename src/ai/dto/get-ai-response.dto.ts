import { IsNotEmpty, IsString } from 'class-validator';
export class GetAIResponseDto {
  @IsString()
  @IsNotEmpty()
  userprompt: string;
}