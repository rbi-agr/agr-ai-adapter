import { IsNotEmpty, IsString } from 'class-validator';
export class TranslateLanguageDto {
  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  target: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
