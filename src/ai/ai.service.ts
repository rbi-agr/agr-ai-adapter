import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DetectLanguageDto } from './dto/detect-language.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/logger/logger.service';
import { TranslateLanguageDto } from './dto/translate-language.dto';
import { CheckIntentDto } from './dto/check-intent-dto';
import { CheckTransactionDatesDto } from './dto/check-transaction-dates.dto';

@Injectable()
export class AIService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService
  ) {}
  async detectLanguage(detectLanguageDto: DetectLanguageDto) {
    try {
      //TODO: Call the translator API for detecting the language.
      let response = {
        language: 'en',
        error: 'null',
      };
      return response;
    } catch (error) {
      this.logger.error('This is an error log message', 'Optional error trace');
      throw new HttpException(error.response || 'Wallet service not running', error.response?.status || error.status || 500);
    }
  }
  async translateLanguage(translateLanguageDto: TranslateLanguageDto) {
    try {
      //TODO: Call the translator API for translating the language.
      let response = {
        translated: 'नमस्ते दुनिया',
        targetLanguage: 'hi',
        error: 'null',
      };
      return response;
    } catch (error) {
      this.logger.error('This is an error log message', 'Optional error trace');
      throw new HttpException(error.response || 'Wallet service not running', error.response?.status || error.status || 500);
    }
  }
  async checkIntent(checkIntentDto: CheckIntentDto) {
    try {
      //TODO: Call the intent classifier API for checking the intent.
      let response = {
        category: 'String',
        type: 'String',
        subtype: 'String',
        error: 'null',
      };
      return response;
    } catch (error) {
      this.logger.error('This is an error log message', 'Optional error trace');
      throw new HttpException(error.response || 'Wallet service not running', error.response?.status || error.status || 500);
    }
  }
  async checkTransactionDates(checkTransactionDatesDto: CheckTransactionDatesDto) {
    try {
      //TODO: Call the mistral API for checking the transaction dates.
      let response = {
        transaction_startdate: 'String',
        transaction_enddate: 'String',
        error: 'null',
      };
      return response;
    } catch (error) {
      this.logger.error('This is an error log message', 'Optional error trace');
      throw new HttpException(error.response || 'Wallet service not running', error.response?.status || error.status || 500);
    }
  }
}
