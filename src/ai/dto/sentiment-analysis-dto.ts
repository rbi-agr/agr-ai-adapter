import { IsNotEmpty, IsString } from 'class-validator';
export class SentimentAnalysisDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}