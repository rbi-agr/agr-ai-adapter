import { IsNotEmpty, IsString } from 'class-validator';
export class RuleEngineDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}