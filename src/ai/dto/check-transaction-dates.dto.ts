import { IsNotEmpty, IsString } from 'class-validator';
export class CheckTransactionDatesDto {
  @IsString()
  @IsNotEmpty()
  userprompt: string;

  @IsString()
  @IsNotEmpty()
  task: string;

}