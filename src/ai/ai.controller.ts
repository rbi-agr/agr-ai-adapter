import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AIService } from './ai.service';
import { DetectLanguageDto } from './dto/detect-language.dto';
import { TranslateLanguageDto } from './dto/translate-language.dto';
import { CheckIntentDto } from './dto/check-intent-dto';
import { GetAIResponseDto } from './dto/get-ai-response.dto';
import { RuleEngineDto } from './dto/rule-engine-dto';
import { SentimentAnalysisDto } from './dto/sentiment-analysis-dto';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}
  @Post('/language-detect')
  detectLanguage(@Body() detectLanguageDto: DetectLanguageDto) {
    return this.aiService.detectLanguage(detectLanguageDto);
  }
  @Post('/language-translate')
  translateLanguage(@Body() translateLanguageDto: TranslateLanguageDto) {
    return this.aiService.translateLanguage(translateLanguageDto);
  }
  @Post('/intent-classifier')
  checkIntent(@Body() checkIntentDto: CheckIntentDto) {
    return this.aiService.checkIntent(checkIntentDto);
  }
  @Post('/generate-prompt')
  getGenerativeResponse(@Body() getAIResponseDto: GetAIResponseDto) {
    return this.aiService.getAIResponse(getAIResponseDto);
  }
  @Post('/rule-engine')
  ruleEngine(@Body() ruleEngineDto: RuleEngineDto) {
    return this.aiService.ruleEngine(ruleEngineDto);
  }
  @Post('/sentiment-analysis')
  sentimentAnalysis(@Body() sentimentAnalysisDto: SentimentAnalysisDto) {
    return this.aiService.sentimentAnalysis(sentimentAnalysisDto);
  }
}
