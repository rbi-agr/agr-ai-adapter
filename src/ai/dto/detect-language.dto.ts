import { IsNotEmpty, IsString } from 'class-validator';
export class DetectLanguageDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
