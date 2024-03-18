import { IsNotEmpty, IsString } from 'class-validator';
export class GetAIResponseDto {
  @IsString()
  @IsNotEmpty()
  userprompt: string;

  @IsString()
  @IsNotEmpty()
  task: string;

}