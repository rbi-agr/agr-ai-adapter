import { IsNotEmpty, IsString } from 'class-validator';
export class RagDataDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}