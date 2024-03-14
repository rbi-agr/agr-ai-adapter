import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AIService } from './ai.service';
import { DetectLanguageDto } from './dto/detect-language.dto';
import { TranslateLanguageDto } from './dto/translate-language.dto';
import { CheckIntentDto } from './dto/check-intent-dto';
import { CheckTransactionDatesDto } from './dto/check-transaction-dates.dto';

@Controller('user')
export class AIController {
  constructor(private readonly aiService: AIService) {}
  @Post()
  detectLanguage(@Body() detectLanguageDto: DetectLanguageDto) {
    return this.aiService.detectLanguage(detectLanguageDto);
  }
  @Post()
  translateLanguage(@Body() translateLanguageDto: TranslateLanguageDto) {
    return this.aiService.translateLanguage(translateLanguageDto);
  }
  @Post()
  checkIntent(@Body() checkIntentDto: CheckIntentDto) {
    return this.aiService.checkIntent(checkIntentDto);
  }
  @Post()
  checkTransactionDates(@Body() checkTransactionDatesDto: CheckTransactionDatesDto) {
    return this.aiService.checkTransactionDates(checkTransactionDatesDto);
  }
}
